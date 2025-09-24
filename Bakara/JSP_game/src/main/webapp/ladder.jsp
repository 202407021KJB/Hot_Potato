<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title> 사다리 게임 </title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
    #game-container { display: inline-block; }
    #ladder-container { position: relative; }
    #ladderCanvas { border: 1px solid #333; }
    .btn { padding: 10px 16px; border: none; background: #4a7; color: #fff; border-radius: 6px; cursor: pointer; margin: 10px; }
    .btn:disabled { background: #ccc; }
    .btn:active { transform: translateY(1px); }
        #player-inputs, #result-outputs { display: flex; justify-content: space-between; max-width: 400px; margin: 10px auto; }
    .player-box, .result-box { width: 80px; text-align: center; padding: 0 5px; }
    input { width: 100%; box-sizing: border-box; }
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
  <h1>사다리 게임</h1>

  <!-- 인원 설정 UI는 ladder_setup.html로 이동되어 삭제됨 -->

    <div id="game-container" data-context-path="${pageContext.request.contextPath}">
    <div id="player-inputs"></div>
    <div id="ladder-container">
      <canvas id="ladderCanvas" width="500" height="400"></canvas>
    </div>
    <div id="result-outputs"></div>
  </div>

  <div>
    <button id="startBtn" class="btn">사다리 생성</button>
  </div>

  <script src="js/game.js"></script>
</body>
</html>