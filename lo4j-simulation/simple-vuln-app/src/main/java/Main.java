import com.logick.LogicK;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Scanner;

public class Main {

    private static final Logger logger = LogManager.getLogger(Main.class);

    public static void main(String[] args) {

        // 🔐 Initialize LogiK SDK (TEST CONFIG)
        LogicK.init(
                "cl_a99eede532fa9ee5135df620",
                "ae83ed29a1fe62b025ce71adbd2913929e09b7a2580b011392ee869d20986910"
        );

        System.out.println("LogiK initialized.");
        System.out.println("Enter input to log:");

        Scanner scanner = new Scanner(System.in);

        while (true) {
            String input = scanner.nextLine();

            // Log4j log
            logger.info("User input: {}", input);
        }
    }
}
