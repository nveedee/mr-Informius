import {useEffect, useState} from "react";
import styles from "../styles/keyboard.module.css";
import "react-simple-keyboard/build/css/index.css";

type KeyboardProps = {
    id: string;
    username : string
    llocation : string
    onSubmit?: () => void;
};

export default function MyKeyboard({id,username,llocation, onSubmit}: KeyboardProps) {
    const [userName, setUserName] = useState<string>(username);
    const [location, setLocation] = useState<string>(llocation)
    const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
    const [isNameSelected, setIsNameSelected] = useState<boolean>(true);


    function handleButtonClick(button: string) {
        const character = isShiftActive ? button.toUpperCase() : button.toLowerCase();
        if (isNameSelected) {
            setUserName(userName + character);
        } else {
            setLocation(location + character);
        }

        // Reset shift after one character is typed
        if (isShiftActive) {
            setIsShiftActive(false);
        }
    }

    const handleSubmit = () => {
        if (userName === "" || location === ""){
            alert("Please type something in. - You have empty fields.")
        } else {
            fetch(`http://localhost:8080/api/persons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id, userName, location}),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success:", data);

                    if (onSubmit) {
                        onSubmit();
                    }
                })
                .catch((error) => console.error("Error:", error));
        }
    };

    useEffect(() => {

    }, []);

    function handleBackSpace() {
        if (isNameSelected) {
            const newInput = userName.slice(0, -1);
            setUserName(newInput);
        } else {
            const newInput = location.slice(0, -1);
            setLocation(newInput);
        }
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
                    onClick={() => setIsNameSelected(true)}
                    value={userName}
                    readOnly
                    className={styles.input}
                    placeholder="Name..."
                />
                <input
                    onClick={() => setIsNameSelected(false)}
                    value={location}
                    readOnly
                    className={styles.input}
                    placeholder="Wohnort..."
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
