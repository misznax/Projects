import bpy, sys, json, os
sys.path.insert(0,'/home/claude/work/data')
import struct_lig, struct_nerv, struct_vess
Z='/home/claude/zref/Z-Anatomy/Resources/Models/FBX/'
OUT='/home/claude/work/out3'
JOBS=[('Joints100','L','lig',struct_lig.LIG),('NervousSystem100','N','nerv',struct_nerv.NERV),('CardioVascular41','V','vess',struct_vess.VESS)]
allids={}
for fbx,pref,fn,lst in JOBS:
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.fbx(filepath=Z+fbx+'.fbx')
    by={o.name:o for o in bpy.data.objects if o.type=='MESH'}
    objs=[]; ids={}
    for i,e in enumerate(sorted(lst,key=lambda e:e[1])):
        o=by.get(e[1]+'.r') or by.get(e[1])
        assert o is not None,e[1]
        ids[pref+'%03d'%i]=e[1]; o.name=pref+'%03d'%i; objs.append(o)
    for o in bpy.data.objects: o.select_set(False)
    for o in objs:
        mw=o.matrix_world.copy(); o.parent=None; o.matrix_world=mw
    bpy.context.view_layer.update()
    for o in objs: o.select_set(True); o.data.materials.clear()
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{fn}.glb',export_format='GLB',use_selection=True,export_materials='NONE',export_apply=True,export_cameras=False,export_lights=False,export_yup=True,export_image_format='NONE',export_normals=True,export_tangents=False,export_texcoords=False,export_attributes=False,export_extras=False)
    print('EXPORTED',fn,len(objs),sum(len(o.data.vertices) for o in objs),os.path.getsize(f'{OUT}/{fn}.glb')//1024,'KB')
    allids.update(ids)
json.dump(allids,open(OUT+'/struct_ids.json','w'),indent=0,ensure_ascii=False)
