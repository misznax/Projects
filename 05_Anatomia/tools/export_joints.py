import bpy, re, json, os, sys
from mathutils import Vector
from mathutils.bvhtree import BVHTree
Z='/home/claude/zref/Z-Anatomy/Resources/Models/FBX/'
OUT='/home/claude/work/out2'
def load(p):
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.fbx(filepath=p)
def export(objs,fn):
    for o in bpy.data.objects: o.select_set(False)
    for o in objs:
        mw=o.matrix_world.copy(); o.parent=None; o.matrix_world=mw
    bpy.context.view_layer.update()
    for o in objs:
        o.select_set(True)
        if o.type=='MESH': o.data.materials.clear()
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{fn}',export_format='GLB',use_selection=True,export_materials='NONE',export_apply=True,export_cameras=False,export_lights=False,export_yup=True,export_image_format='NONE',export_normals=True,export_tangents=False,export_texcoords=False,export_attributes=False,export_extras=False)
    print('EXPORTED',fn,len(objs),os.path.getsize(f'{OUT}/{fn}')//1024,'KB')
def g(o,v): return [round(v.x,5),round(v.z,5),round(-v.y,5)]

# ---------- szkielet: styki ----------
load(Z+'SkeletalSystem100.fbx')
B={o.name:o for o in bpy.data.objects if o.type=='MESH'}
dg=bpy.context.evaluated_depsgraph_get()
def verts(o): return [o.matrix_world@v.co for v in o.data.vertices]
_bvh={}
def bvh(o):
    if o.name not in _bvh:
        _bvh[o.name]=BVHTree.FromObject(o,dg)
    return _bvh[o.name]
def near(o,p):
    loc=bvh(o).find_nearest(o.matrix_world.inverted()@p)
    return None if loc[0] is None else (o.matrix_world@loc[0])
mid=sum((verts(B['Manubrium of sternum'])[i] for i in range(len(B['Manubrium of sternum'].data.vertices))),Vector())/len(B['Manubrium of sternum'].data.vertices)
MIDX=mid.x
print('MIDX',MIDX,'humerus bbox',[round(x,3) for x in (max(v.x for v in verts(B['Humerus.r']))-min(v.x for v in verts(B['Humerus.r'])), max(v.z for v in verts(B['Humerus.r']))-min(v.z for v in verts(B['Humerus.r'])))])
def contact(a,b,tol=0.004,split=None):
    A=B[a]; Bo=B[b]
    da=[(( (p-(near(Bo,p) or p)).length),p) for p in verts(A)[::2]]
    db=[(((p-(near(A,p) or p)).length),p) for p in verts(Bo)[::2]]
    dmin=min(d for d,_ in da+db)
    pts=[p for d,p in da+db if d<=dmin+tol]
    if split=='r': pts=[p for p in pts if p.x>MIDX+0.01]
    elif split=='l': pts=[p for p in pts if p.x<MIDX-0.01]
    elif split=='m': pts=[p for p in pts if abs(p.x-MIDX)<=0.01]
    elif split in ('zhi','zlo'):
        zs=[v.z for v in verts(B['Radius.r'])]
        pts=[p for p in pts if (p.z>max(zs)-0.03 if split=='zhi' else p.z<min(zs)+0.03)]
    if not pts: return None
    c=sum(pts,Vector())/len(pts)
    ext=max(max(p[i] for p in pts)-min(p[i] for p in pts) for i in range(3))
    return dict(p=g(None,c),r=round(max(0.0045,min(0.03,ext*0.55)),4),dmin=round(dmin*1000,1),n=len(pts),a=a,b=b,split=split)
F=['Second','Third','Fourth','Fifth']
def ph(f,k): return f'{k} phalanx of {f} finger of hand.r'
def mc(f): return f'{f} metacarpal bone.r'
J={}
J['scj']=[('Clavicle.r','Manubrium of sternum',None)]
J['acj']=[('Clavicle.r','Scapula.r',None)]
J['ghj']=[('Humerus.r','Scapula.r',None)]
J['hu']=[('Humerus.r','Ulna.r',None)]
J['hr']=[('Humerus.r','Radius.r',None)]
J['pru']=[('Radius.r','Ulna.r','zhi')]
J['dru']=[('Radius.r','Ulna.r','zlo')]
J['rcj']=[('Radius.r','Scaphoid bone.r',None),('Radius.r','Lunate bone.r',None)]
J['mcj']=[('Scaphoid bone.r','Trapezium bone.r',None),('Scaphoid bone.r','Capitate bone.r',None),('Lunate bone.r','Capitate bone.r',None),('Triquetrum bone.r','Hamate bone.r',None)]
J['icj']=[('Trapezium bone.r','Trapezoid bone.r',None),('Trapezoid bone.r','Capitate bone.r',None),('Capitate bone.r','Hamate bone.r',None),('Scaphoid bone.r','Lunate bone.r',None),('Lunate bone.r','Triquetrum bone.r',None),('Triquetrum bone.r','Pisiform bone.r',None)]
J['cmc1']=[('Trapezium bone.r','First metacarpal bone.r',None)]
J['cmc2']=[('Trapezoid bone.r','Second metacarpal bone.r',None),('Capitate bone.r','Third metacarpal bone.r',None),('Hamate bone.r','Fourth metacarpal bone.r',None),('Hamate bone.r','Fifth metacarpal bone.r',None)]
J['mcp1']=[('First metacarpal bone.r',ph('first','Proximal'),None)]
J['mcp2']=[(mc(f),ph(f.lower(),'Proximal'),None) for f in F]
J['ip1']=[(ph('first','Proximal'),ph('first','Distal'),None)]
J['pip']=[(ph(f.lower(),'Proximal'),ph(f.lower(),'Middle'),None) for f in F]
J['dip']=[(ph(f.lower(),'Middle'),ph(f.lower(),'Distal'),None) for f in F]
J['aoj']=[('Occipital bone','Atlas (C1)','r'),('Occipital bone','Atlas (C1)','l')]
J['aam']=[('Atlas (C1)','Axis (C2)','m')]
J['aal']=[('Atlas (C1)','Axis (C2)','r'),('Atlas (C1)','Axis (C2)','l')]
J['tmj']=[('Mandible','Temporal bone.r',None),('Mandible','Temporal bone.l',None)]
res={}
for k,prs in J.items():
    res[k]=[]
    for a,b,sp in prs:
        if a not in B or b not in B: print('BRAK',a,b); continue
        c=contact(a,b,split=sp)
        if c is None: print('PUSTY',k,a,b,sp); continue
        res[k].append(c); print(k,a[:22],'|',b[:22],sp,c['dmin'],'mm n',c['n'],'r',c['r'])
json.dump(dict(mid=round(MIDX,5),joints=res),open(OUT+'/joint_pos.json','w'))

# ---------- czaszka + kręgi szyjne -> axial.glb ----------
AX=re.compile(r'^(Ethmoid bone|Frontal bone|Occipital bone|Sphenoid bone|Vomer|Mandible|Maxilla\.[lr]|Temporal bone\.[lr]|Parietal bone\.[lr]|Zygomatic bone\.[lr]|Nasal bone\.[lr]|Lacrimal bone\.[lr]|Palatine bone\.[lr]|Inferior nasal concha bone\.[lr]|Atlas \(C1\)|Axis \(C2\)|Vertebra C[3-6])$')
ax=sorted([o for o in B.values() if AX.match(o.name)],key=lambda o:o.name)
AXID={}
for i,o in enumerate(ax): AXID['S%03d'%i]=o.name
print('AXIAL',len(ax),sum(len(o.data.vertices) for o in ax))
for i,o in enumerate(ax): o.name='S%03d'%i
json.dump(AXID,open(OUT+'/axial_ids.json','w'),indent=0)
export(ax,'axial.glb')

# ---------- torebki / krążki ----------
load(Z+'Joints100.fbx')
CAP=re.compile(r'^(Articular capsule of (acromioclavicular|elbow|glenohumeral|radiocarpal|sternoclavicular|temporomandibular) joint|Articular capsules of (distal|proximal) interphalangeal joints|Articular capsules of metacarpophalangeal joints|Articular disc of (acromioclavicular|distal radio-ulnar|sternoclavicular|temporomandibular) joint|Annular ligament of radius)\.[lr]$')
cp=sorted([o for o in bpy.data.objects if o.type=='MESH' and CAP.match(o.name) and (o.name.endswith('.r') or 'temporomandibular' in o.name)],key=lambda o:o.name)
CID={}
for i,o in enumerate(cp): CID['C%03d'%i]=o.name
print('CAPS',len(cp),[o.name for o in cp])
for i,o in enumerate(cp): o.name='C%03d'%i
json.dump(CID,open(OUT+'/cap_ids.json','w'),indent=0)
export(cp,'joints.glb')
