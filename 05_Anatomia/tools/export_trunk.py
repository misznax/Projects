import bpy, json, os, sys
sys.path.insert(0,'/home/claude/work/data')
import trunk_content as T
Z='/home/claude/zref/Z-Anatomy/Resources/Models/FBX/'
OUT='/home/claude/work/out3'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=Z+'MuscularSystem100.fbx')
mus={o.name:o for o in bpy.data.objects if o.type=='MESH'}
objs=[];ids={}
for i,k in enumerate(sorted(T.MESH3)):
    o=mus.get(k+'.r') or mus.get(k); assert o is not None,k
    ids['T%03d'%i]=k; o.name='T%03d'%i; objs.append(o)
before=set(bpy.data.objects)
bpy.ops.import_scene.fbx(filepath=Z+'SkeletalSystem100.fbx')
sk={o.name:o for o in bpy.data.objects if o.type=='MESH' and o not in before}
for i,k in enumerate(sorted(T.BONES3)):
    o=sk.get(k); assert o is not None,k
    ids['Q%03d'%i]=k; o.name='Q%03d'%i; objs.append(o)
for o in bpy.data.objects: o.select_set(False)
for o in objs:
    mw=o.matrix_world.copy(); o.parent=None; o.matrix_world=mw
bpy.context.view_layer.update()
for o in objs:
    n=len(o.data.vertices); print('V',o.name,ids[o.name],n)
    if n>8000 and o.name.startswith('T'):
        bpy.context.view_layer.objects.active=o
        m=o.modifiers.new('d','DECIMATE'); m.ratio=7500/n
    o.select_set(True); o.data.materials.clear()
bpy.ops.export_scene.gltf(filepath=OUT+'/trunk.glb',export_format='GLB',use_selection=True,export_materials='NONE',export_apply=True,export_cameras=False,export_lights=False,export_yup=True,export_image_format='NONE',export_normals=True,export_tangents=False,export_texcoords=False,export_attributes=False,export_extras=False)
json.dump(ids,open(OUT+'/trunk_ids.json','w'),indent=0,ensure_ascii=False)
print('EXPORTED',len(objs),sum(len(o.data.vertices) for o in objs),os.path.getsize(OUT+'/trunk.glb')//1024,'KB')
