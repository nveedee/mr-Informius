import { useState, useRef, ChangeEvent } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function MyKeyboard(){
    const [layoutName, setLayoutName] = useState<string>("default");
    const [input, setInput] = useState<string>("");
    const keyboardRef = useRef<string | null>(null);

    const onChange = (input: string) => {
        setInput(input);
        console.log("Input changed", input);
    };

    const onKeyPress = (button: string) => {
        console.log("Button pressed", button);
        if (button === "{shift}" || button === "{lock}") handleShift();
    };

    const handleShift = () => {
        setLayoutName(prevLayoutName => (prevLayoutName === "default" ? "shift" : "default"));
    };

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setInput(input);
        if (keyboardRef.current) {
            keyboardRef.current.setInput(input);
        }
    };

    return (
        <div>
            <input
                value={input}
                placeholder={"Tap on the virtual keyboard to start"}
                onChange={onChangeInput}
            />
            <Keyboard
                keyboardRef={r => (keyboardRef.current = r)}
                layoutName={layoutName}
                onChange={onChange}
                onKeyPress={onKeyPress}
            />
        </div>
    );
};

