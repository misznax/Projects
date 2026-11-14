import json, re, sys
sys.path.insert(0,'/home/claude/work/data')
import content as C
O='/home/claude/work/out/'
mid=json.load(open(O+'muscle_ids.json')); bid=json.load(open(O+'bone_ids.json')); bn=json.load(open(O+'bone_names.json'))
pp=dict(bn['patch_parent'])  # patch en -> bone en
lmparent=dict(bn['lm'])
en2id={v:k for k,v in bid.items()}
def strip(n): return re.sub(r'\.(r|t|(o|e)\d?r)$','',n)

# ---- muscles
groups={}
for k,v in C.M.items(): groups[k]=dict(v, ids=[])
muscles=[]
for i,en in sorted(mid.items()):
    st=strip(en); g,ppl,pla=C.MESH[st]   # KeyError = brak tłumaczenia
    groups[g]['ids'].append(i)
    muscles.append(dict(id=i,en=st,grp=g,pl=ppl,la=pla))
for g in list(groups):
    if not groups[g]['ids']: del groups[g]

# ---- bones
def hand_name(en):
    m=re.match(r'^(Proximal|Middle|Distal) phalanx of (\w+) finger of hand$',en)
    if m:
        kind,f=m.groups(); fp,rom,lat=C.FINGER[f]
        kp={'Proximal':'bliższy','Middle':'środkowy','Distal':'dalszy'}[kind]; kl={'Proximal':'proximalis','Middle':'media','Distal':'distalis'}[kind]
        return (f'Paliczek {kp} {fp} ({rom})', f'Phalanx {kl} digiti {rom} manus' if f!='first' else f'Phalanx {kl} pollicis', 'Paliczek ręki.')
    m=re.match(r'^(\w+) metacarpal bone$',en)
    if m:
        f=m.group(1).lower(); rom=C.FINGER[f][1]
        return (f'Kość śródręcza {rom}', f'Os metacarpi {rom}','Kość śródręcza.')
    return None
def region_of(en):
    if en in ('Clavicle','Scapula'): return 'bark'
    if en=='Humerus': return 'ramie'
    if en in ('Radius','Ulna'): return 'przedramie'
    if en.endswith('bone') and en in C.BONES and en not in ('Manubrium of sternum','Body of sternum'): return 'dlon'
    if 'phalanx' in en or 'metacarpal' in en: return 'dlon'
    return 'kontekst'
bones=[]
for i,en0 in sorted(bid.items()):
    if i[0]!='B': continue
    en=strip(en0); kind='bone'; d=''
    if en in C.BONES: pl,la,d=C.BONES[en]
    elif hand_name(en): pl,la,d=hand_name(en)
    elif en.endswith(' rib'):
        n=C.ROMAN[C.ORD[en.split()[0]]]; pl,la,d=f'Żebro {n}',f'Costa {n}','Żebro prawe (kontekst: przyczepy mięśni zębatego przedniego i piersiowego mniejszego).'; kind='ctx'
    elif en.startswith('Vertebra '):
        v=en.split()[1]
        if v=='C7': pl,la,d='Kręg szyjny VII (wyniosły)','Vertebra cervicalis VII (prominens)','Kontekst: przyczep m. równoległobocznego mniejszego i więzadła karkowego.'
        else:
            n=C.ROMAN[int(v[1:])]; pl,la,d=f'Kręg piersiowy {n}',f'Vertebra thoracica {n}','Kontekst: początek m. równoległobocznych i trapezowego.'
        kind='ctx'
    else: raise KeyError(en)
    if en in ('Manubrium of sternum','Body of sternum','Xiphoid process'): kind='ctx'
    bones.append(dict(id=i,en=en,pl=pl,la=la,d=d,kind=kind,region=region_of(en) if kind=='bone' else 'kontekst'))
bone_by_en0={b['id']:b for b in bones}

# ---- patches: rola origin/insertion
def rank(en):
    if 'rib' in en or 'sternum' in en: return 0
    if en=='Clavicle': return 1
    if en=='Scapula': return 2
    if en=='Humerus': return 3
    if en=='Ulna': return 4.0
    if en=='Radius': return 4.1
    if 'metacarpal' in en: return 6
    if en.startswith('Proximal'): return 7
    if en.startswith('Middle'): return 8
    if en.startswith('Distal'): return 9
    return 5
patches=[]; tmp={}
for i,en0 in sorted(bid.items()):
    if i[0]!='P': continue
    base=re.sub(r'\.(o|e)\d?r$','',en0)
    if base not in C.PATCH: continue
    bone_en=strip(pp[en0]); bone_id=en2id[pp[en0]]
    for g in C.PATCH[base]:
        tmp.setdefault(g,[]).append((i,bone_id,rank(bone_en),base,en0))
for g,lst in tmp.items():
    mx=max(r for _,_,r,_,_ in lst)
    for i,b,r,base,en0 in lst:
        if g in C.ORIGIN_ONLY: role='o'
        elif g in C.INSERT_ONLY: role='i'
        elif base.startswith('Common'): role='o'
        else: role='i' if r==mx else 'o'
        patches.append(dict(id=i,bone=b,grp=g,role=role))

# ---- landmarks
LPOS=json.load(open(O+'lm_pos.json'))
lms=[]
for i,en0 in sorted(bid.items()):
    if i[0]!='L': continue
    en=strip(en0)
    if en in ('Scapula','Humerus','Radius','Ulna'): continue
    pl,la,d=C.LM[en]
    if i not in LPOS: print('brak pozycji',en0); continue
    lms.append(dict(id=i,en=en,pl=pl,la=la,d=d,bone=en2id[lmparent[en0]],p=LPOS[i]))
# usuń z GLB nieużywane id? (pominięte: korzenie L) — aplikacja ignoruje węzły spoza data.json
REG=[('all','Cała kończyna'),('bark','Bark'),('ramie','Ramię'),('przedramie','Przedramię'),('dlon','Dłoń')]
out=dict(version='0.01',regions=REG,groups=groups,muscles=muscles,bones=bones,patches=patches,lms=lms)
json.dump(out,open(O+'data.json','w'),ensure_ascii=False,separators=(',',':'))
print('muscles',len(muscles),'groups',len(groups),'bones',len(bones),'patches',len(patches),'lms',len(lms))
missing=[b for b in bid if b[0]=='P' and re.sub(r'\.(o|e)\d?r$','',bid[b]) not in C.PATCH]
print('patches bez mapy:',[bid[b] for b in missing])
import collections
print(collections.Counter((p['role']) for p in patches))
for g in ('biceps','triceps','pecmajor','serratus','fds','dio'):
    print(g,[(p['bone'],p['role']) for p in patches if p['grp']==g])
