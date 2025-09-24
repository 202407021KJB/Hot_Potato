package com.example.ladder.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

@WebServlet("/ladder")
public class LadderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Random random = new Random();

    // JSON 구조에 맞는 데이터 클래스 정의
    private static class Rung {
        int y;
        int col;

        Rung(int y, int col) {
            this.y = y;
            this.col = col;
        }
    }

    private static class LadderData {
        List<Double> xPositions;
        List<Rung> rungs;

        LadderData(List<Double> xPositions, List<Rung> rungs) {
            this.xPositions = xPositions;
            this.rungs = rungs;
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("--- LadderServlet doGet() 호출됨 ---");
        try {
            // 1. 플레이어 수 받기
            int numPlayers = Integer.parseInt(request.getParameter("players"));
            if (numPlayers < 2) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "플레이어는 2명 이상이어야 합니다.");
                return;
            }

            // 2. 사다리 데이터 생성 (game.js 로직을 Java로 변환)
            double ladderTop = 50;
            double ladderBottom = 350;
            double ladderLeft = 50;
            double ladderRight = 450;

            double stepX = (ladderRight - ladderLeft) / (numPlayers - 1);
            List<Double> xPositions = new ArrayList<>();
            for (int i = 0; i < numPlayers; i++) {
                xPositions.add(ladderLeft + i * stepX);
            }

            List<Rung> rungs = new ArrayList<>();
            int yStep = 28;
            for (int y = (int) ladderTop + 20; y < ladderBottom - 20; y += yStep) {
                List<Integer> placedInLevel = new ArrayList<>();
                for (int i = 0; i < numPlayers - 1; i++) {
                    if (placedInLevel.contains(i)) continue;
                    if (random.nextFloat() > 0.5) {
                        rungs.add(new Rung(y, i));
                        placedInLevel.add(i);
                        placedInLevel.add(i + 1);
                    }
                }
            }

            LadderData ladderData = new LadderData(xPositions, rungs);

            // 3. JSON으로 변환하여 응답
            String jsonResponse = new Gson().toJson(ladderData);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonResponse);
            System.out.println("사다리 데이터 JSON 응답 완료");

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "플레이어 수가 올바르지 않습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "사다리 데이터 생성 중 오류 발생");
        }
    }
}
