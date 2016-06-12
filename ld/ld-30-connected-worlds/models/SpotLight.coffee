class Spotlight
  constructor: (x, y, z) ->
    geometry = new THREE.CylinderGeometry(0.05, 1.25, 6, 32 * 2, 20, true)

    geometry.applyMatrix new THREE.Matrix4().makeTranslation(0, -geometry.height / 2, 0)
    geometry.applyMatrix new THREE.Matrix4().makeRotationX(-Math.PI / 2)

    @material = new THREEx.VolumetricSpotLightMaterial()
    @volumetricSpotlight  = new THREE.Mesh(geometry, @material)
    @volumetricSpotlight.position.set x, y, z
    @volumetricSpotlight.lookAt new THREE.Vector3(0, 0, 0)
    @material.uniforms.lightColor.value.set "white"
    @material.uniforms.spotPosition.value = @volumetricSpotlight.position

    @spotLight = new THREE.SpotLight()
    @spotLight.position = @volumetricSpotlight.position
    @spotLight.color = @volumetricSpotlight.material.uniforms.lightColor.value
    @spotLight.exponent = 30
    @spotLight.angle = Math.PI / 3
    @spotLight.intensity = 4

    light = @spotLight
    light.castShadow = true
    light.shadowCameraNear = 0.01
    light.shadowCameraFar = 15
    light.shadowCameraFov = 45
    light.shadowCameraLeft = -8
    light.shadowCameraRight = 8
    light.shadowCameraTop = 8
    light.shadowCameraBottom = -8

    #light.shadowCameraVisible = true
    light.shadowBias = 0.0
    light.shadowDarkness = 0.5
    light.shadowMapWidth = 1024
    light.shadowMapHeight = 1024

  setColor: (color) ->
    @material.uniforms.lightColor.value.set color

  distanceTo: (node) ->
    @spotLight.position.distanceTo(node.position)

  lookAt: (node) ->
    target = node.position
    @volumetricSpotlight.lookAt target
    @spotLight.target.position.copy target

