const fs = require('fs');
const path = require('path');

// Создаем простой HTML файл для генерации изображения
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AB Hero App Image</title>
    <style>
        body { margin: 0; padding: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="canvas" width="640" height="360"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Градиентный фон
        const gradient = ctx.createLinearGradient(0, 0, 640, 360);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 640, 360);
        
        // Декоративные звезды
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 640;
            const y = Math.random() * 360;
            const size = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Основной логотип AB
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(220, 100, 200, 160);
        
        // Скругленные углы
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.roundRect(220, 100, 200, 160, 20);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        
        // Белый текст AB
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AB', 320, 180);
        
        // Подзаголовок
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillText('A/B Hero', 320, 280);
        
        // Описание
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText('AI-тренажер для собеседований', 320, 310);
        
        // Декоративные линии
        ctx.strokeStyle = 'rgba(0, 230, 118, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(590, 50);
        ctx.moveTo(50, 310);
        ctx.lineTo(590, 310);
        ctx.stroke();
        
        // Поддержка roundRect
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
        
        // Автоматически скачиваем изображение
        setTimeout(() => {
            const dataURL = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.download = 'ab-hero-miniapp-640x360.jpg';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 1000);
    </script>
</body>
</html>
`;

// Сохраняем HTML файл
fs.writeFileSync('generate-image-simple.html', htmlContent);

console.log('✅ HTML файл создан: generate-image-simple.html');
console.log('📝 Откройте его в браузере для генерации изображения');
console.log('💾 Изображение автоматически скачается в формате JPEG 640x360');
