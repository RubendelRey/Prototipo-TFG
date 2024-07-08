import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SolidLoginSuccessful() {
    const [, setCookie] = useCookies(["solidSession"]);
    const navigate = useNavigate();
    setCookie("solidSession", true);

    useEffect((
    ) => {
        navigate("/profile")
    }, [navigate]);
    navigate("/profile");
    return (<div></div>)
}