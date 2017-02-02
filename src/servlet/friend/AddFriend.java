package servlet.friend;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by jruiz on 2/2/17.
 */
public class AddFriend extends HttpServlet{

    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {

        resp.setContentType("text/json");
        PrintWriter out = resp.getWriter();

        String from = req.getParameter("from");
        String to = req.getParameter("to");

        JSONObject response = service.friend.AddFriendService.addFriend(from, to);
        out.println(response);
    }
}
