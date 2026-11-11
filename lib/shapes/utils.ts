export function drawHex(args:{
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    startAngle?: number,
    borderColor?: string,
    fillColor?: string,
    borderWidth?: number
}): void {
    const startAngle = args.startAngle ?? -Math.PI / 6;
    const borderColor = args.borderColor ?? "#000000"
    const fillColor = args.fillColor ?? "#00000000"
    const borderWidth = args.borderWidth ?? 5

    args.ctx.beginPath();
    
    for (let i = 0; i < 6; i++) {
        const angle = startAngle + (i * 2 * Math.PI) / 6;
        const px = args.x + args.radius * Math.cos(angle);
        const py = args.y + args.radius * Math.sin(angle);
        
        if (i === 0) {
            args.ctx.moveTo(px, py);
        } else {
            args.ctx.lineTo(px, py);
        }
    }
    
    args.ctx.closePath();
    args.ctx.strokeStyle = borderColor;
    args.ctx.lineWidth = borderWidth;
    args.ctx.stroke();
    args.ctx.fillStyle = fillColor;
    args.ctx.fill();
}

export function drawCircle(args: {
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    startAngle?: number,
    endAngle?: number,
    borderColor?: string,
    fillColor?: string
    borderWidth?: number
}): void {
    const startAngle = args.startAngle ?? 0;
    const endAngle = args.endAngle ?? Math.PI * 2;
    const borderColor = args.borderColor ?? "#000000";
    const fillColor = args.fillColor ?? "#00000000";
    const borderWidth = args.borderWidth ?? 5

    args.ctx.beginPath();
    args.ctx.arc(args.x, args.y, args.radius, startAngle, endAngle);
    args.ctx.closePath();

    args.ctx.fillStyle = fillColor;
    args.ctx.fill();

    args.ctx.strokeStyle = borderColor;
    args.ctx.lineWidth = borderWidth;
    args.ctx.stroke();
}