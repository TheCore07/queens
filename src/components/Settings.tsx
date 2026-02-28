import {Button} from "@/components/ui/button.tsx";
import {SettingsIcon} from "lucide-react";

export default function Settings() {

    return (
        <div className="justify-end">
            <Button>
                <SettingsIcon />
            </Button>
        </div>
    )
}