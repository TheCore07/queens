import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "@/hooks/useTheme.ts";
import { getBoard } from "@/api/Game.ts";
import { useEffect, useState } from "react";
import type {BoardCellInterface} from "@/interfaces/BoardCell.interface.ts";
import BoardCell from "@/components/queens/BoardCell.tsx";

function App() {
    const { setTheme } = useTheme();


    return (
        <div className="p-4 space-y-4">
            <div className="space-x-2">
                <Button onClick={() => setTheme("white")}>White</Button>
                <Button onClick={() => setTheme("dark")}>Dark</Button>
                <Button onClick={() => setTheme("pink")}>Pink</Button>
                
            </div>


        </div>
    );
}

export default App;
