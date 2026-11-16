import bpy, re, json, os
Z='/home/claude/zref/Z-Anatomy/Resources/Models/FBX/MuscularSystem100.fbx'
OUT='/home/claude/work/out3'
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.fbx(filepath=Z)
SKIP=re.compile(r'Epicranial aponeurosis|Common tendinous|tarsus|Trochlea|Palatopharyngeus|pharyngeal|Stylopharyngeus|arytenoid|cricothyroid|thyro-arytenoid|Genioglossus|Hyoglossus|rectus muscle|oblique muscle|Levator palpebrae|Ary-epi|Thyro-epi',re.I)
NECKBACK=re.compile(r'^(Splenius capitis|Splenius colli|Longissimus capitis|Spinalis capitis|Semispinalis colli|Multifidus colli|Obliquus inferior capitis|Obliquus superior capitis|Rectus posterior (major|minor) capitis)')
def keep(o):
    if o.type!='MESH' or not o.name.endswith('.r'): return False
    n=o.name[:-2]
    p=[]; q=o.parent
    while q: p.append(q.name); q=q.parent
    ch=' '.join(p).lower()
    if NECKBACK.match(n): return True
    if SKIP.search(n) or 'fasci' in ch: return False
    return ('muscles of neck' in ch or 'muscles of head' in ch or 'digastric' in ch)
objs=sorted([o for o in bpy.data.objects if keep(o)],key=lambda o:o.name)
ids={}
for i,o in enumerate(objs):
    ids['H%03d'%i]=o.name; o.name='H%03d'%i
for o in bpy.data.objects: o.select_set(False)
for o in objs:
    mw=o.matrix_world.copy(); o.parent=None; o.matrix_world=mw
bpy.context.view_layer.update()
for o in objs:
    o.select_set(True); o.data.materials.clear()
bpy.ops.export_scene.gltf(filepath=OUT+'/headmus.glb',export_format='GLB',use_selection=True,export_materials='NONE',export_apply=True,export_cameras=False,export_lights=False,export_yup=True,export_image_format='NONE',export_normals=True,export_tangents=False,export_texcoords=False,export_attributes=False,export_extras=False)
json.dump(ids,open(OUT+'/head_ids.json','w'),indent=0,ensure_ascii=False)
print('EXPORTED',len(objs),os.path.getsize(OUT+'/headmus.glb')//1024,'KB')
for k,v in ids.items(): print(k,v)
