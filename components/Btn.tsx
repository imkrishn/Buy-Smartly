'use client';
import { Button } from "./ui/button";

interface BtnProps {
  label: string;
  onclick: () => void;
}

export default function Btn({ label, onclick }: BtnProps) {
  return (
    <Button variant="secondary" className="w-full" onClick={onclick}>
      {label}
    </Button>
  );
}
