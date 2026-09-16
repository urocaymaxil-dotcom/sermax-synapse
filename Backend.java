import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;

public class Backend {
    public static void main(String[] args) throws IOException {
        int port = 3001;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        
        server.createContext("/api/requests", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                addCorsHeaders(exchange);
                if ("OPTIONS".equals(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                
                String response = "[{\"id\":\"r1\",\"studentId\":\"s1\",\"studentName\":\"Juan Dela Cruz\",\"section\":\"BSCS 2A\",\"subject\":\"Data Structures and Algorithms\",\"preferredDate\":\"2026-09-17\",\"preferredTime\":\"10:00\",\"purpose\":\"Clarification on Graph Traversal algorithms.\",\"status\":\"Pending\",\"priorityScore\":85,\"waitDays\":2,\"displacementCount\":0,\"createdAt\":\"2026-09-15T08:00:00Z\"}]";
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });

        server.createContext("/api/availability", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                addCorsHeaders(exchange);
                if ("OPTIONS".equals(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }
                
                String response = "[{\"id\":\"avail1\",\"facultyId\":\"f1\",\"dayOfWeek\":\"Monday\",\"date\":\"2026-09-20\",\"startTime\":\"13:00\",\"endTime\":\"15:00\",\"type\":\"available\"}]";
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Java Backend is successfully running on http://localhost:" + port);
    }
    
    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
}
