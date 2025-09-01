import { Send } from "lucide-react";
import React from "react";
import { Card } from "./ui/card";

const CardContent = () => {
  const cardItems = [
    {
      icon: Send,
      title: "Requisition Requests",
      no: 8,
      color: "#0F1E7A"
    },
    {
      icon: Send,
      title: "Approved Requests",
      no: 8,
      color: "#26850B"
    },
    {
      icon: Send,
      title: "Rejected Requests",
      no: 8,
      color: "#DC3545"
    },
  ]
  return (
    <>
      <div className="flex gap-6">
        {cardItems.map((card) => (
          <Card key={card.title} className="flex items-center gap-3 px-20 py-4 shadow-md" style={{ borderLeft: `4px solid ${card.color}` }}>
          <div className="flex px-2 py-2 justify-center items-center rounded-full " style={{ backgroundColor: card.color }}>
            <card.icon size={18} color="white" />
          </div>
          <p className="text-[#121212] text-lg font-light">
          {card.title}
          </p>
          <p className="text-[#0F1E7A] text-3xl font-bold">{card.no}</p>
        </Card>
        ))}
      </div>
    </>
  );
};

export default CardContent;
