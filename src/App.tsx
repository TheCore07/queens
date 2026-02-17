import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import Board from "@/components/queens/Board";
import { useQueensGame } from "@/hooks/queens/useQueensGame";

function App() {
    const { setTheme } = useTheme();
    const {
        board,
        isLoading,
        cycleCell,
        undo,
        reset,
        isWin,
    } = useQueensGame();

    return (
        <div className="p-4 space-y-4">
            <div className="space-x-2">
                <Button onClick={() => setTheme("white")}>White</Button>
                <Button onClick={() => setTheme("dark")}>Dark</Button>
                <Button onClick={() => setTheme("pink")}>Pink</Button>
            </div>

            {isLoading && <div>Loading...</div>}

            {board && (
                <Board
                    board={board}
                    onCellClick={cycleCell}
                    onUndo={undo}
                    onReset={reset}
                />
            )}

            {isWin() && (
                <div className="mt-4 text-green-600 text-xl font-bold">
                    🎉 Du hast gewonnen!
                </div>
            )}
        </div>
    );
}

export default App;
