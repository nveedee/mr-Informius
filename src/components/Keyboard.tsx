import {useState} from "react";
import styles from "../styles/keyboard.module.css";
import "react-simple-keyboard/build/css/index.css";

type KeyboardProps = {
    id: string;
    onSubmit?: () => void;
};

export default function MyKeyboard({id, onSubmit}: KeyboardProps) {
    const [userName, setUserName] = useState<string>("");
    const [isShiftActive, setIsShiftActive] = useState<boolean>(false);

    function handleButtonClick(button: string) {
        const character = isShiftActive ? button.toUpperCase() : button.toLowerCase();
        setUserName(userName + character);

        // Reset shift after one character is typed
        if (isShiftActive) {
            setIsShiftActive(false);
        }
    }

    const handleSubmit = () => {
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
                }
            })
            .catch((error) => console.error("Error:", error));

    };

    function handleBackSpace() {
        const newInput = userName.slice(0, -1);
        setUserName(newInput);
    }

    function handleShift() {
        setIsShiftActive(!isShiftActive);
    }

    const renderButton = (letter: string) => {
        const displayLetter = isShiftActive ? letter.toUpperCase() : letter.toLowerCase();
        return (
            <button onClick={() => handleButtonClick(letter)}>{displayLetter}</button>
        );
    };

    return (
        <div className={styles.Tastatur}>
            <div className={styles.inputfield}>
                <input
                    value={userName}
                    readOnly
                    className={styles.input}
                    placeholder="Name..."
                />
                <button className={styles.submit} onClick={handleSubmit}>Submit</button>
            </div>

            <div>
                {renderButton("q")}
                {renderButton("w")}
                {renderButton("e")}
                {renderButton("r")}
                {renderButton("t")}
                {renderButton("z")}
                {renderButton("u")}
                {renderButton("i")}
                {renderButton("o")}
                {renderButton("p")}
            </div>

            <div>
                {renderButton("a")}
                {renderButton("s")}
                {renderButton("d")}
                {renderButton("f")}
                {renderButton("g")}
                {renderButton("h")}
                {renderButton("j")}
                {renderButton("k")}
                {renderButton("l")}
                <button onClick={handleBackSpace}>
                    <img src="../../public/icons8-backspace-24.png" alt="Backspace"/>
                </button>
            </div>

            <div>
                <button onClick={handleShift}>
                    <img src="../../public/icons8-shift-24.png" alt="Shift"/>
                </button>
                {renderButton("y")}
                {renderButton("x")}
                {renderButton("c")}
                {renderButton("v")}
                {renderButton("b")}
                {renderButton("n")}
                {renderButton("m")}
            </div>
            <div>
                <button className={styles.space} onClick={() => handleButtonClick(" ")}>
                    Space
                </button>
            </div>
        </div>
    );
}
