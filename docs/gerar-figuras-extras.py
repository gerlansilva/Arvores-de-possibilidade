import math, os, subprocess, json
from PIL import Image, ImageFilter, ImageChops
OUT="saida-figuras"; os.makedirs(OUT,exist_ok=True)
K="#5b2e1b"
R="#e8503a";O="#f39c2b";Y="#fbc318";G="#5aa845";B="#2f5fa8";P="#f79aa8";CR="#f6e7c8";LB="#cfe6f7";DK="#3d2b3a"
def svg(body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="768" height="768"><g stroke="{K}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">{body}</g></svg>'
def hl(cx,cy,rx,ry,rot=-30): return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#fff" fill-opacity=".45" stroke="none" transform="rotate({rot} {cx} {cy})"/>'
def poly(pts,fill,extra=""): return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in pts)}" fill="{fill}" {extra}/>'
def star(cx,cy,ro,ri,n=5):
    pts=[]
    for i in range(2*n):
        a=-math.pi/2+i*math.pi/n; r=ro if i%2==0 else ri
        pts.append((cx+r*math.cos(a),cy+r*math.sin(a)))
    return pts
F={}
# ---- Formas
F["formas/circulo"]=("Círculo azul",svg(f'<circle cx="128" cy="128" r="92" fill="{B}"/>'+hl(98,92,34,16)))
F["formas/quadrado"]=("Quadrado vermelho",svg(f'<rect x="38" y="38" width="180" height="180" rx="16" fill="{R}"/>'+hl(84,74,30,12,-20)))
F["formas/triangulo"]=("Triângulo amarelo",svg(poly([(128,32),(224,210),(32,210)],Y)+hl(112,130,12,34,25)))
F["formas/estrela"]=("Estrela verde",svg(poly(star(128,132,102,46),G)+hl(110,96,16,8,-30)))
# ---- Balões
def balao(c):
    return svg(f'<path d="M128 188 C124 206 140 214 130 238" fill="none" stroke-width="5"/><path d="M128 168 L114 190 L142 190 Z" fill="{c}"/><ellipse cx="128" cy="98" rx="66" ry="76" fill="{c}"/>'+hl(104,66,16,30,25))
for n,c,nm in [("vermelho",R,"Balão vermelho"),("azul",B,"Balão azul"),("amarelo",Y,"Balão amarelo"),("verde",G,"Balão verde")]:
    F[f"cores/balao-{n}"]=(nm,balao(c))
# ---- Pizza
def pizza(topo):
    s=f'<circle cx="128" cy="128" r="104" fill="#e6a85c"/><circle cx="128" cy="128" r="86" fill="#f8cf6a"/>'
    s+=''.join(f'<line x1="128" y1="128" x2="{128+86*math.cos(a):.1f}" y2="{128+86*math.sin(a):.1f}" stroke-width="3" stroke-opacity=".55"/>' for a in [i*math.pi/4+0.2 for i in range(8)])
    return s+topo
pts=[(128,78),(86,104),(172,100),(100,150),(156,152),(128,186),(70,142),(188,146)]
F["pizza/queijo"]=("Pizza de queijo",svg(pizza(''.join(f'<ellipse cx="{x}" cy="{y}" rx="13" ry="9" fill="#fde9a3" stroke-width="3" stroke-opacity=".5"/>' for x,y in pts[:6]))))
F["pizza/calabresa"]=("Pizza de calabresa",svg(pizza(''.join(f'<circle cx="{x}" cy="{y}" r="15" fill="#c8402c" stroke-width="4"/><circle cx="{x-4}" cy="{y-3}" r="3" fill="#8f2a1b" stroke="none"/><circle cx="{x+5}" cy="{y+4}" r="2.5" fill="#8f2a1b" stroke="none"/>' for x,y in pts))))
def cogu(x,y): return f'<path d="M{x-16} {y+4} A16 15 0 0 1 {x+16} {y+4} Z" fill="{CR}" stroke-width="4"/><rect x="{x-6}" y="{y+4}" width="12" height="13" rx="3" fill="#fff4dc" stroke-width="4"/>'
F["pizza/cogumelo"]=("Pizza de cogumelo",svg(pizza(''.join(cogu(x,y) for x,y in pts[:6]))))
F["pizza/milho"]=("Pizza de milho",svg(pizza(''.join(f'<ellipse cx="{x+dx}" cy="{y+dy}" rx="6.5" ry="8" fill="#ffd23a" stroke-width="3" transform="rotate({(x*7+y*3)%60-30} {x+dx} {y+dy})"/>' for x,y in pts for dx,dy in [(-9,-5),(8,4)]))))
# ---- Brinquedos
F["brinquedos/bola"]=("Bola",svg(f'<defs><clipPath id="c"><circle cx="128" cy="128" r="92"/></clipPath></defs><circle cx="128" cy="128" r="92" fill="{R}"/><g clip-path="url(#c)" stroke="none"><path d="M128 36 L220 128 L128 128Z" fill="{Y}"/><path d="M128 128 L36 128 L128 220Z" fill="{B}"/><path d="M128 128 L220 128 L128 220Z" fill="#fff"/></g><circle cx="128" cy="128" r="92" fill="none"/><circle cx="128" cy="128" r="14" fill="#fff"/>'+hl(96,84,22,10,-35)))
def carro(c,alto=False):
    cab=f'<path d="M78 112 L98 72 L162 72 L186 112 Z" fill="{c}"/><path d="M92 108 L106 80 L126 80 L126 108Z M134 108 L134 80 L158 80 L174 108Z" fill="{LB}" stroke-width="4"/>'
    return svg(cab+f'<rect x="32" y="108" width="192" height="62" rx="20" fill="{c}"/><rect x="190" y="124" width="22" height="12" rx="5" fill="{Y}" stroke-width="4"/>'+''.join(f'<circle cx="{x}" cy="176" r="26" fill="{DK}"/><circle cx="{x}" cy="176" r="10" fill="#cfd6e0" stroke-width="4"/>' for x in (82,176)))
F["brinquedos/carrinho"]=("Carrinho vermelho",carro(R))
F["transportes/carro"]=("Carro azul",carro(B))
F["brinquedos/pipa"]=("Pipa",svg(f'<path d="M128 198 C100 214 156 224 124 244" fill="none" stroke-width="5"/>'+poly([(128,24),(128,108),(58,108)],R)+poly([(128,24),(198,108),(128,108)],Y)+poly([(58,108),(128,108),(128,198)],B)+poly([(128,108),(198,108),(128,198)],G)+'<path d="M128 24 L128 198 M58 108 L198 108" fill="none" stroke-width="4"/>'))
F["brinquedos/bloco"]=("Bloco",svg(poly([(128,40),(210,84),(128,128),(46,84)],Y)+poly([(46,84),(128,128),(128,220),(46,174)],B)+poly([(210,84),(128,128),(128,220),(210,174)],R)+hl(128,76,26,10,0)))
# ---- Transportes
F["transportes/onibus"]=("Ônibus amarelo",svg(f'<rect x="26" y="52" width="204" height="124" rx="24" fill="{Y}"/>'+''.join(f'<rect x="{x}" y="72" width="34" height="38" rx="8" fill="{LB}" stroke-width="4"/>' for x in (42,84,126))+f'<rect x="170" y="72" width="44" height="86" rx="8" fill="{LB}" stroke-width="4"/><line x1="26" y1="128" x2="162" y2="128" stroke-width="4"/>'+''.join(f'<circle cx="{x}" cy="180" r="24" fill="{DK}"/><circle cx="{x}" cy="180" r="9" fill="#cfd6e0" stroke-width="4"/>' for x in (76,176))))
F["transportes/barco"]=("Barco",svg(f'<line x1="124" y1="30" x2="124" y2="166" stroke-width="6"/>'+poly([(120,36),(120,150),(54,150)],CR)+poly([(132,64),(132,150),(196,150)],R)+f'<path d="M30 156 L226 156 L196 206 L60 206 Z" fill="{B}"/><path d="M20 224 C50 206 70 240 100 222 C130 206 150 240 180 222 C205 210 225 232 238 224" fill="none" stroke="{B}" stroke-width="9"/>'))
F["transportes/aviao"]=("Avião",svg(f'<path d="M106 112 L24 168 L24 190 L106 160Z" fill="{B}"/><path d="M150 112 L232 168 L232 190 L150 160Z" fill="{B}"/><path d="M108 206 L78 230 L78 240 L108 228Z" fill="{B}"/><path d="M148 206 L178 230 L178 240 L148 228Z" fill="{B}"/><path d="M128 18 C150 18 152 50 152 80 L152 214 C152 234 104 234 104 214 L104 80 C104 50 106 18 128 18Z" fill="#f2f6fb"/><path d="M114 44 Q128 30 142 44 L142 62 Q128 54 114 62Z" fill="{LB}" stroke-width="4"/>'))
# ---- Dados
pos={1:[(0,0)],2:[(-1,-1),(1,1)],3:[(-1,-1),(0,0),(1,1)],4:[(-1,-1),(1,-1),(-1,1),(1,1)],5:[(-1,-1),(1,-1),(0,0),(-1,1),(1,1)],6:[(-1,-1),(1,-1),(-1,0),(1,0),(-1,1),(1,1)]}
for n,ps in pos.items():
    F[f"dados/dado-{n}"]=(f"Dado {n}",svg(f'<rect x="36" y="36" width="184" height="184" rx="34" fill="#fffaf0"/>'+''.join(f'<circle cx="{128+x*46}" cy="{128+y*46}" r="14" fill="{DK}" stroke="none"/>' for x,y in ps)))
# ---- Clima
sol=''.join(poly([(128,18),(144,54),(112,54)],O).replace('/>',f' transform="rotate({a} 128 128)"/>') for a in range(0,360,45))
F["clima/sol"]=("Sol",svg(sol+f'<circle cx="128" cy="128" r="56" fill="{Y}"/>'+hl(110,108,18,8,-35)))
nuv=lambda c,dy=0:f'<path d="M64 {190+dy} C22 {190+dy} 18 {128+dy} 64 {124+dy} C64 {78+dy} 134 {64+dy} 156 {106+dy} C198 {94+dy} 230 {140+dy} 196 {190+dy} Z" fill="{c}"/>'
F["clima/nuvem"]=("Nuvem",svg(nuv("#e3edf8")))
gota=lambda x,y:f'<path d="M{x} {y} C{x-18} {y+26} {x-14} {y+44} {x} {y+44} C{x+14} {y+44} {x+18} {y+26} {x} {y}Z" fill="{B}" stroke-width="5"/>'
F["clima/chuva"]=("Chuva",svg(nuv("#b8c8dc",-30)+gota(84,176)+gota(128,190)+gota(172,176)))
F["clima/lua"]=("Lua",svg(f'<path d="M156 30 C92 36 50 90 62 150 C74 208 138 238 196 214 C130 208 100 150 124 96 C134 72 148 48 156 30Z" fill="#fbd96b"/>'+poly(star(196,70,16,7),Y)))
# ---- Flores
def flor(petal,center,n=8,r=44,d=52):
    s=''.join(f'<ellipse cx="128" cy="{128-d}" rx="{r*0.62}" ry="{r}" fill="{petal}" transform="rotate({i*360//n} 128 128)"/>' for i in range(n))
    return svg(s+f'<circle cx="128" cy="128" r="30" fill="{center}"/>')
F["flores/girassol"]=("Girassol",flor(Y,"#8a5a2e",12,34,60))
F["flores/margarida"]=("Margarida",flor("#ffffff",Y,10,34,58))
F["flores/rosa"]=("Flor rosa",flor(P,Y,6,46,50))
F["flores/azul"]=("Flor azul",flor("#7fa6e0","#fff4dc",5,50,48))

# ---- render + sticker
meta=[]
for key,(nome,body) in F.items():
    tema,idf=key.split("/")
    os.makedirs(f"{OUT}/{tema}",exist_ok=True)
    open(f"tmp-figura.svg","w").write(body)
    subprocess.run(["rsvg-convert","-w","768","-h","768","tmp-figura.svg","-o","tmp-figura.png"],check=True)
    im=Image.open("tmp-figura.png").convert("RGBA")
    a=im.split()[3]
    grow=a.filter(ImageFilter.MaxFilter(31))
    grow=grow.filter(ImageFilter.GaussianBlur(1.2)).point(lambda v:255 if v>100 else 0)
    base=Image.new("RGBA",im.size,(0,0,0,0))
    sh=Image.new("RGBA",im.size,(27,42,65,0)); sh.putalpha(grow.filter(ImageFilter.GaussianBlur(7)).point(lambda v:int(v*0.22)))
    sh=ImageChops.offset(sh,0,8)
    base.alpha_composite(sh)
    white=Image.new("RGBA",im.size,(255,255,255,255)); white.putalpha(grow)
    base.alpha_composite(white); base.alpha_composite(im)
    bb=base.getbbox(); base=base.crop(bb)
    base.thumbnail((340,340),Image.LANCZOS)
    base.save(f"{OUT}/{tema}/{idf}.png")
    meta.append({"tema":tema,"id":idf,"nome":nome,"arquivo":f"extras/{tema}/{idf}.png"})
json.dump(meta,open("figuras-extras.json","w"),ensure_ascii=False,indent=1)
# contact sheet
fs=[m["arquivo"].replace("extras/",OUT+"/") for m in meta]
cols=8; cell=170
W=Image.new("RGBA",(cols*cell,((len(fs)+cols-1)//cols)*cell),(246,248,251,255))
for i,f in enumerate(fs):
    im=Image.open(f); im.thumbnail((cell-10,cell-10)); W.alpha_composite(im,((i%cols)*cell+5,(i//cols)*cell+5))
W.save("folha-de-contato.png"); print(len(meta))
