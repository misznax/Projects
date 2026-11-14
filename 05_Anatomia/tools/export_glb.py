import bpy, sys, re, json
SK='/home/claude/zref/Z-Anatomy/Resources/Models/FBX/SkeletalSystem100.fbx'
MU='/home/claude/zref/Z-Anatomy/Resources/Models/FBX/MuscularSystem100.fbx'
OUT='/home/claude/work/out'
import os; os.makedirs(OUT,exist_ok=True)
def chain(o):
    c=[];p=o.parent
    while p: c.append(p.name); p=p.parent
    return c
def load(path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=path)
def export(objs,fn):
    for o in bpy.data.objects: o.select_set(False)
    for o in objs:
        mw=o.matrix_world.copy(); o.parent=None; o.matrix_world=mw
    bpy.context.view_layer.update()
    for o in objs:
        o.select_set(True)
        if o.type=='MESH':
            o.data.materials.clear()
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{fn}',export_format='GLB',use_selection=True,export_materials='NONE',export_apply=True,export_cameras=False,export_lights=False,export_yup=True,export_image_format='NONE',export_normals=True,export_tangents=False,export_texcoords=False,export_attributes=False,export_extras=False)
    print('EXPORTED',fn,len(objs),'objs',os.path.getsize(f'{OUT}/{fn}')//1024,'KB')

# ---------- MUSCLES ----------
load(MU)
EXTRA=re.compile(r'(Trapezius|Pectoralis|Latissimus|Rhomboid|Levator scapulae|Serratus anterior|Subclavius)')
BAD=re.compile(r'bursa|sheath|fascia|septum|Serratus posterior|Cruciform|Superficial transverse metacarpal|Synovial|Adductor brevis|brevis\.r$',re.I)
def keep_m(o):
    if o.type!='MESH' or not o.name.endswith('.r'): return False
    ch=' '.join(chain(o))
    inup='upper limb' in ch.lower() or 'Scapulohumeral' in ch
    if not (inup or EXTRA.search(o.name) or EXTRA.search(ch)): return False
    if BAD.search(o.name) and not re.search(r'(Abductor pollicis brevis|Extensor carpi radialis brevis|Extensor pollicis brevis|flexor pollicis brevis)',o.name): return False
    if 'lower limb' in ch.lower() or 'foot' in o.name.lower() or 'hallucis' in o.name.lower() or 'Fibularis' in o.name: return False
    return True
mus=[o for o in bpy.data.objects if keep_m(o)]
MN=[o.name for o in mus]
json.dump(sorted(o.name for o in mus),open(OUT+'/muscle_names.json','w'),indent=0)
print('MUSCLES',len(mus),sum(len(o.data.vertices) for o in mus))
MID={}
for i,o in enumerate(sorted(mus,key=lambda o:o.name)):
    MID['M%03d'%i]=o.name; o.name='M%03d'%i
json.dump(MID,open(OUT+'/muscle_ids.json','w'),indent=0)
export(mus,'muscles.glb')

# ---------- BONES ----------
load(SK)
RIB=re.compile(r'^(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth) rib\.r$')
mnames=set(re.sub(r'\.r$','',n) for n in MN)
def isbone(o):
    if o.type!='MESH' or not o.name.endswith('.r'): return False
    ch=' '.join(chain(o))
    return ('Bones of free part of upper limb.g' in ch or 'Bones of pectoral girdle.g' in ch or 'Bones of hand.g' in ch) and not re.search(r'\.(o|e)\d?r$',o.name)
def isctx(o):
    if o.type!='MESH': return False
    n=o.name
    return bool(RIB.match(n) or n in ('Manubrium of sternum','Body of sternum','Xiphoid process') or re.match(r'^Vertebra (T\d+|C7)$',n))
bones=[o for o in bpy.data.objects if isbone(o)]
ctx=[o for o in bpy.data.objects if isctx(o)]
print('BONES',[o.name for o in bones]); print('CTX',[o.name for o in ctx])
keep_parents=set(o.name for o in bones+ctx)
DENY=re.compile(r'Sternocleidomastoid|Transversus|Omohyoid|Sternohyoid|Serratus posterior|intercost|Scalen|Sternothyroid|Rectus abdominis|oblique|Diaphragm|Erector|Iliocostalis|Longissimus|Spinalis|Splenius|Semispinalis|Multifidus|Levator costarum|Levatores|Rotatores|Subcostal|Quadratus|Iliacus|Psoas|Thoracolumbar|Longus colli|Longus capitis|Stylohyoid|Trapezius.*lower',re.I)
def ispatch(o):
    if o.type!='MESH' or not re.search(r'\.(o|e)\d?r$',o.name): return False
    base=re.sub(r'\.(o|e)\d?r$','',o.name)
    if DENY.search(base): return False
    return o.parent is not None and o.parent.name in keep_parents
patch=[o for o in bpy.data.objects if ispatch(o)]
from mathutils import Vector
from mathutils.bvhtree import BVHTree
def centroid(o):
    pts=[o.matrix_world@Vector(c) for c in o.bound_box]
    return sum(pts,Vector())/8
LP={}
for o in bpy.data.objects:
    if o.type=='EMPTY' and o.name.endswith('.t') and o.parent is not None and o.parent.name in set(b.name for b in bones):
        j=bpy.data.objects.get(o.name[:-2]+'.j')
        if j is not None:
            LP[o.name]=(centroid(j), o.parent.name)
# kontrola: odległość do powierzchni kości
dists=[]
SN={}
bvh={}
for n,(c,pn) in LP.items():
    b=bpy.data.objects[pn]
    if pn not in bvh:
        dg=bpy.context.evaluated_depsgraph_get(); bvh[pn]=BVHTree.FromObject(b,dg)
    loc=bvh[pn].find_nearest(b.matrix_world.inverted()@c)
    if loc[0] is not None: SN[n]=(b.matrix_world@loc[0]); dists.append((round(((b.matrix_world@loc[0])-c).length*1000,1),n))
dists.sort(); print('LMDIST mm: median',dists[len(dists)//2],'max',dists[-3:])

def islm(o):
    return o.type=='EMPTY' and o.name.endswith('.t') and o.parent is not None and o.parent.name in set(b.name for b in bones)
lm=[o for o in bpy.data.objects if islm(o)]
LM_ORIG={o.name:o for o in lm}
print('PATCH',len(patch),'LM',len(lm))
INFO={'bones':[o.name for o in bones],'ctx':[o.name for o in ctx],'patch':[o.name for o in patch],'lm':[(o.name,o.parent.name) for o in lm],'patch_parent':[(o.name,o.parent.name) for o in patch]}
json.dump(INFO,open(OUT+'/bone_names.json','w'),indent=0)
BID={}
for pre,lst in (('B',bones+ctx),('P',patch),('L',lm)):
    for i,o in enumerate(sorted(lst,key=lambda o:o.name)):
        BID['%s%03d'%(pre,i)]=o.name; o.name='%s%03d'%(pre,i)
json.dump(BID,open(OUT+'/bone_ids.json','w'),indent=0)
INV=dict(BID)
POS={}
for n,(c,pn) in LP.items():
    c=SN.get(n,c); POS[n]=[round(c.x,5),round(c.z,5),round(-c.y,5)]
json.dump({ (k) :POS.get(INV[k]) for k in BID if k[0]=='L' and INV.get(k) in POS},open(OUT+'/lm_pos.json','w'))
export(bones+ctx+patch,'bones.glb')

