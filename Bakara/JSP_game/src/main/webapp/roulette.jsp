<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>룰렛 게임</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
    h1 { color: #333; }
    #game-container { display: inline-block; margin-top: 20px; }
    #canvas-container { position: relative; width: 500px; height: 500px; }
    #pointer { position: absolute; left: 50%; top: -10px; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 30px solid red; z-index: 10; }
    canvas { display: block; }
    .controls { margin-top: 20px; }
    .btn { padding: 10px 16px; border: none; background: #007bff; color: #fff; border-radius: 6px; cursor: pointer; margin: 5px; }
    .btn:disabled { background: #ccc; }
    #options-container input { margin: 2px 5px; width: 100px; }
    #lobby-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 10px 15px;
      background-color: #6c757d;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <a href="index.html" id="lobby-btn">로비로 가기</a>

  <h1>룰렛 게임</h1>

    <div id="options-container" style="margin-top: 20px;"></div>

    <div id="game-container" data-context-path="${pageContext.request.contextPath}">
    <div id="canvas-container">
      <div id="pointer"></div>
      <canvas id="roulette-canvas" width="500" height="500"></canvas>
    </div>
    <button id="spin-btn" class="btn" disabled>돌리기!</button>
  </div>

  <script src="js/roulette.js"></script>
</body>
</html>