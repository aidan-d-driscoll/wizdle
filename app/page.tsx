import { Battle } from "@/components/Battle";
import { GridBattle } from "@/components/GridBattle";

export default function Home() {
  return (
    <div className="flex w-full h-full bg-blue">
      <GridBattle />
    </div>
  );
}
