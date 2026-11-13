"""src/app.src.html -> index.html (wersja samodzielna: /api/ask zamiast platformy claude.ai)."""
import pathlib
r = pathlib.Path(__file__).parent
SHIM = """<script>window.ESN_STANDALONE=true;window.claude={use:async n=>n==='sample'?async(prompt,o)=>{o=o||{};const r=await fetch('/api/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt,tier:o.modelTier}),signal:o.signal});if(!r.ok){let c='error';try{c=(await r.json()).code||c}catch(e){}throw{code:c}}const rd=r.body.getReader(),dc=new TextDecoder();let text='';for(;;){const x=await rd.read();if(x.done)break;text+=dc.decode(x.value,{stream:true});if(o.onText)o.onText({text})}return{text}}:null};</script>"""
s = (r/'src/app.src.html').read_text(encoding='utf-8')
assert '<head>' in s
(r/'index.html').write_text(s.replace('<head>', '<head>\n' + SHIM, 1), encoding='utf-8')
print('OK', len(s))
