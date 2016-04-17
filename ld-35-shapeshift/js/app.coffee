config = Config.get()
config.fillWindow()
config.toggleStats()

engine = new Engine3D()

gameScene = new GameScene()
loadingScene = new LoadingScene([
  # Asset urls
], ->
  gameScene.init()
  engine.sceneManager.setScene(gameScene)
)
engine.addScene(loadingScene)
engine.addScene(gameScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
