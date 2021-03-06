package test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by jruiz on 1/31/17.
 */
public class testMysql {

//    public static void main(String[] args) {
//        try {
//            Connection conn = BD.Database.getMySQLConnection();
//
//            // On cree un nouveau user
//            serviceTools.UserTools.insertUser("miriam", "dominguez", "mdominguez", "123");
//
//            String query = "SELECT * FROM USER";
//            Statement st = conn.createStatement();
//            ResultSet rs = st.executeQuery(query);
//            while (rs.next()) {
//                System.out.println("USER: " + rs.getString("login"));
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//    }

    public static void main(String[] args) {
        /*serviceTools.UserTools.insertUser("javier", "ruiz", "jruiz1",  "email","123");
        serviceTools.UserTools.insertUser("beatriz", "sanchez", "bsanchez1", "email", "123");
        serviceTools.UserTools.insertUser("javier", "revillas", "jrevillas1",  "email", "123");
        serviceTools.UserTools.insertUser("rama", "samb","rsamb1", "email", "123");
*/
        Connection conn = null;
        try {
            conn = BD.Database.getMySQLConnection();
            String query = "SELECT * FROM USER";
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(query);
            while (rs.next()) {
                System.out.println("USER: " + rs.getString("login"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }
}
