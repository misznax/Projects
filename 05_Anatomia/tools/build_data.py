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
import head_content as HC
hid=json.load(open('/home/claude/work/out3/head_ids.json'))
for k,v in HC.M2.items(): groups[k]=dict(v, ids=[])
for i,en in sorted(hid.items()):
    st=strip(en); g,ppl,pla=HC.MESH2[st]
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
# ---- czaszka + kręgi szyjne (axial.glb), stawy (joint_pos.json, joints.glb)
import joints as JD
O2='/home/claude/work/out2/'
axid=json.load(open(O2+'axial_ids.json')); capid=json.load(open(O2+'cap_ids.json')); jp=json.load(open(O2+'joint_pos.json'))
for i,en0 in sorted(axid.items()):
    m=re.match(r'^(.*)\.([lr])$',en0)
    if m and m.group(1) in JD.AXIAL_PAIRED:
        pl,la=JD.AXIAL_PAIRED[m.group(1)]; side='lewa' if m.group(2)=='l' else 'prawa'; sl='sinistra' if m.group(2)=='l' else 'dextra'
        pl,la,d=f'{pl} {side}',f'{la} {sl}','Kość czaszki.'
    elif en0 in JD.AXIAL_BONES: pl,la,d=JD.AXIAL_BONES[en0]
    else: raise KeyError(en0)
    bones.append(dict(id=i,en=en0,pl=pl,la=la,d=d,kind='axial',region='glowa'))
ax_en2id={v:k for k,v in axid.items()}
cap_en2id={v:k for k,v in capid.items()}
def bone_id(en):
    if en in ax_en2id: return ax_en2id[en]
    n=en if en.endswith(('.r','.l')) or en in ('Manubrium of sternum','Body of sternum') else en+'.r'
    return en2id[n]
joints=[]
for j in JD.J:
    marks=[]
    for k in j['mk']: marks+= [dict(p=m['p'],r=m['r']) for m in jp['joints'][k]]
    if not marks: print('brak znaczników',j['id'])
    caps=[cap_en2id[c] for c in j['caps']]
    shp=JD.SHAPES[j['shape']]
    joints.append(dict(id='J_'+j['id'],pl=j['pl'],la=j['la'],reg=j['reg'],rodzaj=j['rodzaj'],shape=j['shape'],ksztalt=j.get('ksztalt',shp[0]),osie=j['osie'],n=j['n'],pow=j['pow'],cechy=j['cechy'],piet=j['piet'],alt=j['alt'],
        bones=[bone_id(b_) for b_ in j['bones']],pairs=[list(p) for p in j['pairs']],caps=caps,marks=marks,mid=bool(j.get('mid')),parent=('J_'+j['parent']) if j.get('parent') else None,children=['J_'+c for c in j.get('children',[])]))
for j in joints:
    for pr in j['pairs']:
        for lst in (pr[1],pr[3]):
            for m in lst:
                if m in C.M or m in HC.M2 or m.startswith('m. ') : continue
                if m not in C.M: print('? klucz mięśnia',m,j['id'])

# ---- tułów, miednica, udo (trunk.glb): mięśnie T###, kości Q###
import trunk_content as TC
tid=json.load(open('/home/claude/work/out3/trunk_ids.json'))
for k,v in TC.M3.items(): groups[k]=dict(v, ids=[])
for i,en in sorted(tid.items()):
    if i[0]=='T':
        g,ppl,pla=TC.MESH3[en]
        groups[g]['ids'].append(i)
        muscles.append(dict(id=i,en=en,grp=g,pl=ppl or groups[g]['pl'],la=pla or groups[g]['la']))
    else:
        pl,la,d=TC.BONES3[en]
        bones.append(dict(id=i,en=en,pl=pl,la=la,d=d,kind='trunk',region='tulow'))
for g in list(groups):
    if not groups[g]['ids']: del groups[g]

# ---- podudzie i stopa (lower.glb): mięśnie L###, kości Q1##
import lower_content as LC
lid=json.load(open('/home/claude/work/out3/lower_ids.json'))
for k,v in LC.M4.items(): groups[k]=dict(v, ids=[])
for i,en in sorted(lid.items()):
    if i[0]=='L':
        g,ppl,pla=LC.MESH4[en]
        groups[g]['ids'].append(i)
        muscles.append(dict(id=i,en=en,grp=g,pl=ppl or groups[g]['pl'],la=pla or groups[g]['la']))
    else:
        pl,la,d=LC.BONES4[en]
        bones.append(dict(id=i,en=en,pl=pl,la=la,d=d,kind='leg',region='podudzie'))

# ---- struktury: więzadła, nerwy, naczynia (lig.glb / nerv.glb / vess.glb)
import struct_lig, struct_nerv, struct_vess
sid=json.load(open('/home/claude/work/out3/struct_ids.json'))
SENT={e[1]:e for e in struct_lig.LIG+struct_nerv.NERV+struct_vess.VESS}
def lig_joints(en):
    n=en
    R=[('sternoclavicular',['scj']),('Interclavicular',['scj']),('Costoclavicular',['scj']),('acromioclavicular',['acj']),('Conoid',['acj']),('Trapezoid ligament',['acj']),
       ('Coraco-acromial',['acj','ghj']),('glenohumeral',['ghj']),('Glenoid labrum',['ghj']),('Coracohumeral',['ghj']),('Transverse humeral',['ghj']),
       ('Annular ligament',['lok','pru']),('Quadrate',['lok','pru']),('elbow',['lok']),('Radial collateral ligament',['lok']),('Ulnar collateral ligament',['lok']),
       ('Interosseous membrane',['dru']),('radio-ulnar',['dru']),
       ('metacarpophalangeal',['mcp2','mcp1']),('transverse metacarpal',['mcp2','mcp1']),('interphalangeal',['pip','dip','ip1']),
       ('carpometacarpal',['cmc2','cmc1']),('metacarpal ligament',['cmc2']),('radiocarpal',['rcj']),('Radioscaph',['rcj']),('Radiocapitate',['rcj']),('Ulnolunate',['rcj']),('Ulnocapitate',['rcj']),('Ulnotriquetral',['rcj']),
       ('of wrist joint',['rcj']),('Radiate carpal',['mcj']),('Dorsal ulnocarpal',['rcj']),
       ('scapholunate',['icj','mcj']),('triquet',['icj','mcj']),('Pis',['icj']),('capit',['icj','mcj']),('scapho',['icj','mcj']),('trapez',['icj','mcj']),('intercarpal',['icj','mcj']),('Palmar lunotriquetral',['icj']),
       ('temporomandibular',['tmj']),('Stylomandibular',['tmj']),('Sphenomandibular',['tmj'])]
    for k,v in R:
        if k.lower() in n.lower(): return v
    return []
structs=[]
for i,en in sorted(sid.items()):
    e=SENT[en]; d=dict(id=i,t=e[0],en=en,pl=e[2],la=e[3],reg=e[4],d=e[5])
    if e[0]=='lig':
        j=lig_joints(en)
        if j: d['j']=['J_'+x for x in j]
    structs.append(d)
REG=[('all','Cała kończyna'),('bark','Bark'),('ramie','Ramię'),('przedramie','Przedramię'),('dlon','Dłoń'),('glowa','Głowa i szyja'),('tulow','Tułów i biodro'),('podudzie','Podudzie i stopa')]
import os
_cp=O+'colors.json'
if os.path.exists(_cp):
    _c=json.load(open(_cp))
    for k,v in groups.items():
        if k in _c: v['col']=_c[k]
out=dict(version='0.07',regions=REG,groups=groups,muscles=muscles,bones=bones,patches=patches,lms=lms,joints=joints,structs=structs,shapes={k:dict(pl=v[0],c=v[1],d=v[2]) for k,v in JD.SHAPES.items()},mid=jp['mid'])
json.dump(out,open(O+'data.json','w'),ensure_ascii=False,separators=(',',':'))
print('muscles',len(muscles),'groups',len(groups),'bones',len(bones),'patches',len(patches),'lms',len(lms))
missing=[b for b in bid if b[0]=='P' and re.sub(r'\.(o|e)\d?r$','',bid[b]) not in C.PATCH]
print('patches bez mapy:',[bid[b] for b in missing])
import collections
print(collections.Counter((p['role']) for p in patches))
for g in ('biceps','triceps','pecmajor','serratus','fds','dio'):
    print(g,[(p['bone'],p['role']) for p in patches if p['grp']==g])
