"""Reproducible licensed score assembly. No repeated source cues or time stretching."""
import concurrent.futures, hashlib, html, json, pathlib, re, subprocess, time, urllib.request, unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[1]
PLAN=json.loads((ROOT/'scripts/suite-plan.json').read_text())
OUT=ROOT/'audio'; OUT.mkdir(exist_ok=True)
CACHE=ROOT/'.audio-build'; CACHE.mkdir(exist_ok=True)
BASE='https://www.scottbuckley.com.au/library/'
def get(url):
    assert url.startswith(('https://www.scottbuckley.com.au/','https://raw.githubusercontent.com/chrisdayley/oathfire/'))
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Emberwake licensed soundtrack builder / CC-BY attribution included'}),timeout=90) as r:return r.read()
        except Exception:
            if attempt==3:raise
            time.sleep(3*(attempt+1))
def clean(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).lower())
def duration(path):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)]))
def run(args):subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-y',*map(str,args)],check=True)
links={}
for url in PLAN['catalogPages']:
    page=get(url).decode()
    for block in re.findall(r'<h2\b[^>]*>(.*?)</h2>',page,re.S):
        a=re.search(r'<a[^>]+href=[\"\x27]([^\"\x27]+)[\"\x27][^>]*>(.*?)</a>',block,re.S)
        if a:links[norm(clean(a[2]))]=html.unescape(a[1])
for url in PLAN['extraPages']:
    page=get(url).decode(); title=clean(re.search(r'<h1\b[^>]*>(.*?)</h1>',page,re.S)[1]);links[norm(title)]=url;links[norm(url.rstrip('/').split('/')[-1])]=url
names=sorted({x for stages in PLAN['suites'].values() for stage in stages for x in stage})
missing=[x for x in names if norm(x) not in links]
assert not missing, f'Missing catalog pages: {missing}'
def prepare(name):
    url=links[norm(name)]; slug=url.rstrip('/').split('/')[-1]; path=CACHE/(slug+'.mp3'); page=get(url).decode()
    assert 'creativecommons.org/licenses/by/4.0' in page, f'No explicit CC BY 4.0 license: {url}'
    mp3s=re.findall(r'(?:href|src)=[\"\x27]([^\"\x27]+\.mp3(?:\?[^\"\x27]*)?)[\"\x27]',page,re.I)
    assert mp3s, f'No recording at {url}'
    source=html.unescape(mp3s[0]).replace('http://','https://')
    if not path.exists():path.write_bytes(get(source))
    seconds=duration(path);assert seconds>60
    print(f'SOURCE {name}: {seconds:.2f}s',flush=True)
    return name,dict(title=name,slug=slug,url=url,download=source,seconds=seconds,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),author='Scott Buckley',license='CC BY 4.0',licenseURL='https://creativecommons.org/licenses/by/4.0/',path=str(path))
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:tracks=dict(pool.map(prepare,names))
# Fail before expensive rendering if a movement selection is too short.
for region,stages in PLAN['suites'].items():
    for phase,names in enumerate(stages):
        needed=(604 if phase<3 else 300)+4*(len(names)-1)
        total=sum(tracks[n]['seconds']-1 for n in names)
        print(f'CAPACITY {region} / {phase}: {total:.2f} / {needed}',flush=True)
        assert total>=needed, f'{region} phase {phase} short: {total} < {needed}'
credits=[]
for region,stages in PLAN['suites'].items():
    seen=[];movements=[];stagefiles=[];start=0
    for phase,names in enumerate(stages):
        target=604 if phase<3 else 300
        assert not any(n in seen for n in names), f'Repeated cue in {region}'
        seen+=names
        # Keep source beginnings in the opening; later movements keep their developed orchestral backends.
        available=[tracks[n]['seconds']-1 for n in names];needed=target+4*(len(names)-1)
        assert sum(available)>=needed, f'{region} phase {phase} short: {sum(available)} < {needed}'
        lengths=[a*needed/sum(available) for a in available]
        args=[];filters=[]
        for i,(name,length) in enumerate(zip(names,lengths)):
            t=tracks[name];offset=0 if phase==0 else max(0,t['seconds']-length-1)
            args+=['-ss',offset,'-t',length,'-i',t['path']]
            filters.append(f'[{i}:a]aresample=32000,aformat=sample_fmts=fltp:channel_layouts=stereo,loudnorm=I=-19:TP=-2:LRA=11,aresample=32000,atrim=duration={length},asetpts=PTS-STARTPTS[a{i}]')
            movements.append(dict(title=name,start=round(start,3),length=round(length,3),sourceOffset=round(offset,3),phase=phase))
            start+=length-4
        prev='a0'
        for i in range(1,len(names)):
            filters.append(f'[{prev}][a{i}]acrossfade=d=4:c1=qsin:c2=qsin[x{i}]');prev=f'x{i}'
        filters.append(f'[{prev}]apad=whole_dur={target},atrim=duration={target}[exact]');prev='exact'
        output=CACHE/f'{region}-{phase}.flac'
        run(args+['-filter_complex',';'.join(filters),'-map',f'[{prev}]','-t',target,'-c:a','flac',output]);stagefiles.append(output)
    args=[]
    for p in stagefiles:args+=['-i',p]
    filters='[0:a][1:a]acrossfade=d=4:c1=qsin:c2=qsin[a];[a][2:a]acrossfade=d=4:c1=qsin:c2=qsin[b];[b][3:a]acrossfade=d=4:c1=qsin:c2=qsin,afade=t=in:d=1,afade=t=out:st=2096:d=4,alimiter=limit=0.89:level=false[out]'
    output=OUT/f'{region}-suite-v27.m4a'
    run(args+['-filter_complex',filters,'-map','[out]','-t',2100,'-c:a','aac','-b:a','128k','-ar',32000,'-movflags','+faststart',output])
    actual=duration(output);assert abs(actual-2100)<.2, f'{region} actual duration {actual}, phases {[duration(p) for p in stagefiles]}'
    credits.append(dict(region=region,file=output.name,seconds=actual,bytes=output.stat().st_size,sha256=hashlib.sha256(output.read_bytes()).hexdigest(),movements=movements))
    for p in stagefiles:p.unlink()
    print(f'SUITE {region}: {actual:.2f}s / {output.stat().st_size} bytes',flush=True)
# Bring the already licensed Oathfire foley banks over intact, with their provenance.
sfx=OUT/'sfx';sfx.mkdir(exist_ok=True)
base='https://raw.githubusercontent.com/chrisdayley/oathfire/main/public/'
manifest=json.loads(get(base+'sfx/foley.json'))
(sfx/'foley.json').write_text(json.dumps(manifest,indent=2))
for bank in manifest['banks'].values():
    data=get(base+'sfx/'+bank['file']);assert hashlib.sha256(data).hexdigest()==bank['sha256'];(sfx/bank['file']).write_bytes(data)
(sfx/'LICENSES.txt').write_bytes(get(base+'licenses/foley-CC0.txt'))
publictracks=[{k:v for k,v in t.items() if k!='path'} for t in tracks.values()]
(OUT/'credits.json').write_text(json.dumps(dict(version=27,changes='Selected excerpts, loudness-balanced, crossfaded into 35-minute suites; AAC 128 kbps stereo. No source cue repeated within a suite.',tracks=publictracks,suites=credits),indent=2))
(OUT/'LICENSES.txt').write_text('Music by Scott Buckley — released under CC-BY 4.0. https://www.scottbuckley.com.au\nLicense: https://creativecommons.org/licenses/by/4.0/\nEdited, excerpted, loudness balanced and crossfaded for Emberwake. These are curated recorded suites, not newly commissioned original compositions.\nTrack titles and source links: credits.json and ../audio-credits.html.\nSound effects: CC0 recordings, see sfx/LICENSES.txt.\n')
print('ALL TEN 35-MINUTE SUITES VERIFIED',flush=True)
