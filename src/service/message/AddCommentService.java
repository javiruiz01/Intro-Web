package service.message;

import org.json.JSONObject;

/**
 * Created by jruiz on 3/20/17.
 */
public class AddCommentService {

    public static JSONObject CreateComment(String key, String text, Integer message_id) {

        if ((key == null) || (text == null) || (message_id == null))
            return serviceTools.ErrorTools.serviceRefused("Wrong arguments", 0);

        String author = serviceTools.UserTools.getUserFromKey(key);

        int author_id = serviceTools.UserTools.getIdUser(author);
        if (author_id < 0)
            return serviceTools.ErrorTools.serviceRefused("Erreur dans la BD", 2);

        JSONObject result = serviceTools.MessageTools.createCommentJSON(text, author, author_id, message_id);

        return result;
    }
}
