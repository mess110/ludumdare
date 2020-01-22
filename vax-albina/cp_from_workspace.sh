#!/usr/bin/env sh

cd ~/vimrc/addons
blender ../../pr0n/vrum/workspace/assets/models/cannons.blend --python export_all_glb.py
cd ~/pr0n/vrum/workspace/games/vax-albina

cp ../../assets/textures/vrum-text.png assets/
cp ../../assets/textures/credits.png assets/
cp ../../assets/textures/credits.png assets/

cp ../../assets/textures/spe_smokeparticle.png assets/
cp ../../assets/textures/spe_star.png assets/
cp ../../assets/particles/hit.json assets/
cp ../../assets/particles/basic.json assets/

cp ../../assets/models/ammo.001.glb assets/models/
cp ../../assets/models/ammo.002.glb assets/models/
cp ../../assets/models/barrel.001.glb assets/models/
cp ../../assets/models/button.bg.001.glb assets/models/
cp ../../assets/models/button.fg.001.glb assets/models/
cp ../../assets/models/button.bg.002.glb assets/models/
cp ../../assets/models/button.fg.002.glb assets/models/
cp ../../assets/models/button.bg.003.glb assets/models/
cp ../../assets/models/button.fg.003.glb assets/models/
cp ../../assets/models/crown.001.glb assets/models/
cp ../../assets/models/chassis.001.glb assets/models/
cp ../../assets/models/chassis.002.glb assets/models/
cp ../../assets/models/chassis.003.glb assets/models/
cp ../../assets/models/chassis.004.glb assets/models/
cp ../../assets/models/cloud.001.glb assets/models/
cp ../../assets/models/coin.001.glb assets/models/
cp ../../assets/models/flag.001.glb assets/models/
cp ../../assets/models/friendzone.001.glb assets/models/
cp ../../assets/models/grass.full.001.glb assets/models/
cp ../../assets/models/heart.001.glb assets/models/
cp ../../assets/models/island.001.glb assets/models/
cp ../../assets/models/island.002.glb assets/models/
cp ../../assets/models/island.002.walk.glb assets/models/
cp ../../assets/models/rench.001.glb assets/models/
cp ../../assets/models/tower.001.glb assets/models/
cp ../../assets/models/tree.001.glb assets/models/
cp ../../assets/models/plaque.001.glb assets/models/
cp ../../assets/models/practice.dummy.001.glb assets/models/
cp ../../assets/models/wall.001.glb assets/models/
cp ../../assets/models/wall.002.glb assets/models/
cp ../../assets/models/wall.corner.001.glb assets/models/
cp ../../assets/models/weapon.001.glb assets/models/
cp ../../assets/models/weapon.002.glb assets/models/
cp ../../assets/models/weapon.003.glb assets/models/
cp ../../assets/models/weapon.004.glb assets/models/
cp ../../assets/models/wheel.001.glb assets/models/
cp ../../assets/models/wheel.002.glb assets/models/
cp ../../assets/models/wheel.003.glb assets/models/
