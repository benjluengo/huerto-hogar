document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Clear existing content
    mapElement.innerHTML = '';

    // Create map container
    const mapContainer = document.createElement('div');
    mapContainer.style.position = 'relative';
    mapContainer.style.width = '100%';
    mapContainer.style.height = '400px';
    mapContainer.style.background = '#f5f5f5';
    mapContainer.style.borderRadius = '12px';
    mapContainer.style.boxShadow = '0 4px 15px rgba(46, 139, 87, 0.3)';
    mapContainer.style.display = 'flex';
    mapContainer.style.justifyContent = 'center';
    mapContainer.style.alignItems = 'center';

    // Create SVG element for Chile shape
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 400");
    svg.setAttribute("width", "80px");
    svg.setAttribute("height", "400px");

    // Create polygon to simulate Chile shape with some curves
    const chilePolygon = document.createElementNS(svgNS, "polygon");
    chilePolygon.setAttribute("points", "40,10 60,30 55,70 65,110 50,150 60,190 55,230 65,270 50,310 60,350 40,390 30,370 35,330 25,290 35,250 30,210 40,170 30,130 40,90 30,50");
    chilePolygon.setAttribute("fill", "#2f855a");
    chilePolygon.setAttribute("stroke", "#ffffff");
    chilePolygon.setAttribute("stroke-width", "2");
    svg.appendChild(chilePolygon);

    // Store locations with coordinates relative to SVG viewBox (approximate)
    const locations = [
        { name: 'Puerto Montt', x: 55, y: 340 },
        { name: 'Villarica', x: 60, y: 290 },
        { name: 'Nacimiento', x: 55, y: 260 },
        { name: 'Concepción', x: 60, y: 230 },
        { name: 'Santiago', x: 50, y: 180 },
        { name: 'Valparaíso', x: 45, y: 170 },
        { name: 'Viña del Mar', x: 45, y: 160 }
    ];

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 12px';
    tooltip.style.background = '#2f855a';
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontFamily = "'Montserrat', sans-serif";
    tooltip.style.fontSize = '14px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s';
    tooltip.style.zIndex = '1000';
    document.body.appendChild(tooltip);

    function showTooltip(evt, text) {
        tooltip.textContent = text;
        tooltip.style.left = evt.pageX + 10 + 'px';
        tooltip.style.top = evt.pageY + 10 + 'px';
        tooltip.style.opacity = '1';
    }

    function hideTooltip() {
        tooltip.style.opacity = '0';
    }

    // Add markers
    locations.forEach(loc => {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", loc.x);
        circle.setAttribute("cy", loc.y);
        circle.setAttribute("r", "6");
        circle.setAttribute("fill", "#2f855a");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "2");
        circle.style.cursor = "pointer";

        // Tooltip events
        circle.addEventListener("mouseenter", (evt) => {
            showTooltip(evt, `Huerto Hogar - ${loc.name}\n¡Nueva tienda disponible!`);
        });
        circle.addEventListener("mousemove", (evt) => {
            showTooltip(evt, `Huerto Hogar - ${loc.name}\n¡Nueva tienda disponible!`);
        });
        circle.addEventListener("mouseleave", hideTooltip);

        // Click event
        circle.addEventListener("click", () => {
            alert(`Huerto Hogar - ${loc.name}\n¡Nueva tienda disponible!`);
        });

        svg.appendChild(circle);
    });

    mapContainer.appendChild(svg);
    mapElement.appendChild(mapContainer);
});
