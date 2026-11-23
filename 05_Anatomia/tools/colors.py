# Przydziela każdej grupie mięśniowej odrębny kolor: graf sąsiedztwa z geometrii GLB (siatki bliżej niż ~1,6 cm)
# + zachłanne kolorowanie (DSATUR) z palety ~100 kolorów rozstawionych w przestrzeni Lab. Uruchamiać: python3 -I colors.py
import json, struct, math, colorsys, numpy as np
W='/home/claude/work/'
D=json.load(open(W+'out/data.json'))
mus2g={m['id']:m['grp'] for m in D['muscles']}
OTHER={k for k,v in D['groups'].items() if v.get('other')}
def glb(path):
    b=open(path,'rb').read(); l=struct.unpack('<I',b[12:16])[0]; j=json.loads(b[20:20+l]); off=20+l+8; bin_=b[off:]
    out={}
    def mat(n):
        if 'matrix' in n: return np.array(n['matrix']).reshape(4,4).T
        t=np.array(n.get('translation',[0,0,0])); q=n.get('rotation',[0,0,0,1]); s=np.array(n.get('scale',[1,1,1]))
        x,y,z,w=q; R=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
        M=np.eye(4); M[:3,:3]=R*s; M[:3,3]=t; return M
    for n in j['nodes']:
        if 'mesh' not in n: continue
        p=j['meshes'][n['mesh']]['primitives'][0]['attributes']['POSITION']; a=j['accessors'][p]; bv=j['bufferViews'][a['bufferView']]
        st=bv.get('byteStride',12); o=bv.get('byteOffset',0)+a.get('byteOffset',0)
        arr=np.frombuffer(bin_,dtype=np.uint8,count=a['count']*st,offset=o).reshape(a['count'],st)[:,:12].copy().view(np.float32).reshape(-1,3)
        M=mat(n); out[n['name']]=(arr@M[:3,:3].T+M[:3,3])
    return out
CELL=0.016
vox={}  # group -> set of voxel tuples
for f in ['out/muscles.glb','out3/headmus.glb','out3/trunk.glb','out3/lower.glb']:
    for name,P in glb(W+f).items():
        g=mus2g.get(name)
        if not g or g in OTHER: continue
        # mięśnie lewej strony nie istnieją w GLB (lustro), więc sąsiedztwo liczymy po prawej + lustrzane odbicie względem x=MIDX niepotrzebne
        v=np.unique(np.floor(P/CELL).astype(np.int32),axis=0)
        vox.setdefault(g,set()).update(map(tuple,v))
groups=sorted(vox); print('grup z geometrią',len(groups),'z',len(D['groups']))
# sąsiedztwo: wspólny voxel lub w 26-sąsiedztwie
cell={}
for g,vs in vox.items():
    for v in vs: cell.setdefault(v,set()).add(g)
adj={g:set() for g in groups}
offs=[(i,j,k) for i in(-1,0,1) for j in(-1,0,1) for k in(-1,0,1)]
for v,gs in cell.items():
    near=set(gs)
    for o in offs:
        n=cell.get((v[0]+o[0],v[1]+o[1],v[2]+o[2]))
        if n: near|=n
    for g in gs: adj[g]|=near-{g}
print('śr. sąsiadów',sum(len(a) for a in adj.values())/len(adj),'max',max(len(a) for a in adj.values()))
# paleta w Lab
def lab(rgb):
    def f(c): c=c/255; return ((c+0.055)/1.055)**2.4 if c>0.04045 else c/12.92
    r,g,b=[f(x) for x in rgb]; X=(r*.4124+g*.3576+b*.1805)/.95047; Y=r*.2126+g*.7152+b*.0722; Z=(r*.0193+g*.1192+b*.9505)/1.08883
    h=lambda t: t**(1/3) if t>0.008856 else 7.787*t+16/116
    fx,fy,fz=h(X),h(Y),h(Z); return np.array([116*fy-16,500*(fx-fy),200*(fy-fz)])
pal=[]
for hh in range(0,360,12):
    for (s,l) in [(0.80,0.52),(0.62,0.66),(0.85,0.40),(0.55,0.46)]:
        if 36<=hh<=66 and l>0.5: continue   # kolory zbliżone do kości (kremowe)
        if 20<=hh<=34 and l<0.5 and s<0.7: continue  # brudne brązy
        c=tuple(int(round(x*255)) for x in colorsys.hls_to_rgb(hh/360,l,s)); pal.append(c)
LAB=np.array([lab(c) for c in pal]); print('paleta',len(pal))
# DSATUR: kolejność wg liczby sąsiadów; wybór koloru maksymalizującego minimalną odległość Lab do kolorów sąsiadów
col={}
order=sorted(groups,key=lambda g:-len(adj[g]))
sat=lambda g:len({col[n] for n in adj[g] if n in col})
todo=set(groups)
used=np.zeros(len(pal),int)
while todo:
    g=max(todo,key=lambda x:(sat(x),len(adj[x])))
    nb=[col[n] for n in adj[g] if n in col]
    best=None;bs=-1
    for i in range(len(pal)):
        if nb: sc=min(np.linalg.norm(LAB[i]-LAB[j]) for j in nb)
        else: sc=100
        sc-=used[i]*1.5   # globalnie rozkładaj użycie kolorów
        if sc>bs: bs=sc;best=i
    col[g]=best; used[best]+=1; todo.discard(g)
res={g:'#%02x%02x%02x'%pal[i] for g,i in col.items()}
# minimalny dystans do sąsiada (kontrola jakości)
mn=[min(np.linalg.norm(LAB[col[g]]-LAB[col[n]]) for n in adj[g]) for g in groups if adj[g]]
print('min dystans Lab do sąsiada: min %.1f, śr. %.1f'%(min(mn),sum(mn)/len(mn)))
json.dump(res,open(W+'out/colors.json','w'),indent=0)
