export default function drawIcon(val, color) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.strokeStyle = color;
    context.beginPath();
    context.arc(50, 50, 25, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(50, 50);
    context.arc(50, 50, 25, 0, val * Math.PI * 2 / 100); // 
    context.lineTo(50, 50);
    context.fill();
    context.stroke();
}