package com.example.roulette.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/roulette")
public class RouletteServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Random random = new Random();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("--- RouletteServlet doGet() 호출됨 ---");

        String[] options = req.getParameterValues("option");

        System.out.println("전달받은 옵션: " + (options != null ? Arrays.toString(options) : "null"));

        if (options == null || options.length == 0) {
            System.out.println("오류: 옵션이 없습니다. 400 Bad Request 응답 전송");
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "옵션이 전달되지 않았습니다.");
            return;
        }

        List<String> optionList = Arrays.asList(options);
        String winner = optionList.get(random.nextInt(optionList.size()));

        System.out.println("선택된 당첨자: " + winner);

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        String jsonResponse = String.format("{\"winner\": \"%s\"}", winner);
        
        resp.getWriter().write(jsonResponse);
        System.out.println("JSON 응답 전송 완료: " + jsonResponse);
    }
}
