import {useState} from "react";
import styles from "../styles/keyboard.module.css";
import "react-simple-keyboard/build/css/index.css";

type KeyboardProps = {
    id: string;
    onSubmit?: () => void;
};

export default function MyKeyboard({id, onSubmit}: KeyboardProps) {
    const [userName, setUserName] = useState<string>("");

    function handleButtonClick(button: string) {
        setUserName(userName + button);
    }

    const handleSubmit = () => {
        console.log(JSON.stringify({id, userName}))
        fetch(`http://localhost:8080/api/persons/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id, userName}),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                // Aufruf der onSubmit Methode, wenn sie definiert ist
                if (onSubmit) {
                    onSubmit();
                }})
            .catch((error) => console.error("Error:", error));

    };

    function handleBackSpace() {
        const newInput = userName.slice(0, -1);
        setUserName(newInput);
    }

    return (
        <div className={styles.Tastatur}>
            <input
                value={userName}
                readOnly
                className={styles.input}
                placeholder="Name..."
            />

            <div>
                <button onClick={() => handleButtonClick("Q")}>Q</button>
                <button onClick={() => handleButtonClick("W")}>W</button>
                <button onClick={() => handleButtonClick("E")}>E</button>
                <button onClick={() => handleButtonClick("R")}>R</button>
                <button onClick={() => handleButtonClick("T")}>T</button>
                <button onClick={() => handleButtonClick("Z")}>Z</button>
                <button onClick={() => handleButtonClick("U")}>U</button>
                <button onClick={() => handleButtonClick("I")}>I</button>
                <button onClick={() => handleButtonClick("O")}>O</button>
                <button onClick={() => handleButtonClick("P")}>P</button>
            </div>

            <div>
                <button onClick={() => handleButtonClick("A")}>A</button>
                <button onClick={() => handleButtonClick("S")}>S</button>
                <button onClick={() => handleButtonClick("D")}>D</button>
                <button onClick={() => handleButtonClick("F")}>F</button>
                <button onClick={() => handleButtonClick("G")}>G</button>
                <button onClick={() => handleButtonClick("H")}>H</button>
                <button onClick={() => handleButtonClick("J")}>J</button>
                <button onClick={() => handleButtonClick("K")}>K</button>
                <button onClick={() => handleButtonClick("L")}>L</button>
            </div>

            <div>
                <button onClick={() => handleButtonClick("Y")}>Y</button>
                <button onClick={() => handleButtonClick("X")}>X</button>
                <button onClick={() => handleButtonClick("C")}>C</button>
                <button onClick={() => handleButtonClick("V")}>V</button>
                <button onClick={() => handleButtonClick("B")}>B</button>
                <button onClick={() => handleButtonClick("N")}>N</button>
                <button onClick={() => handleButtonClick("M")}>M</button>
            </div>
            <div>
                <button onClick={() => handleButtonClick(" ")}>Space</button>
                <button onClick={handleBackSpace}>BackSpace</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}
