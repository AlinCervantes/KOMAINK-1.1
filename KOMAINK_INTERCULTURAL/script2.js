// Asegúrate de que jsPDF esté disponible
            const { jsPDF } = window.jspdf;

            // Mostrar plan seleccionado
            const plan = localStorage.getItem('planSeleccionado') || 'desconocido'; // Manejo de caso si no hay plan
            document.getElementById('info-plan').innerHTML = `
                <h2>Plan seleccionado: ${plan.toUpperCase()}</h2>
                <p>${obtenerDescripcionPlan(plan)}</p>
            `;

            function formatoTarjeta(input) {
                // Formato de tarjeta XXXX XXXX XXXX XXXX
                let valor = input.value.replace(/\s/g, '').replace(/\D/g, '');
                let formato = valor.match(/.{1,4}/g);
                input.value = formato ? formato.join(' ') : '';
                
                // Mostrar número enmascarado
                const tarjetaEnmascaradaDiv = document.getElementById('tarjetaEnmascarada');
                if (valor.length >= 4) { // Muestra si hay al menos 4 dígitos
                    const enmascarado = '**** **** **** ' + valor.slice(-4);
                    tarjetaEnmascaradaDiv.style.display = 'block';
                    tarjetaEnmascaradaDiv.textContent = enmascarado;
                } else {
                    tarjetaEnmascaradaDiv.style.display = 'none';
                }
            }

            // Se elimina la propiedad type="password" si no se quiere ver el valor en el input de CVV
            // Ya está como type="password" por defecto, lo que oculta el valor.

            function simularPayPal() {
                // En una aplicación real, aquí irías a una API de PayPal
                alert('Serás redirigido a PayPal para completar el pago.');
                // Simulación de una ventana emergente de PayPal
                const ventanaPayPal = window.open('', 'PayPal', 'width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
                if (ventanaPayPal) {
                    ventanaPayPal.document.write(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head><title>Pago con PayPal</title>
                        <style>
                            body { font-family: sans-serif; text-align: center; padding: 20px; background-color: #f0f2f5; }
                            h2 { color:rgb(172, 6, 255); }
                            button { background-color:rgb(130, 14, 255); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
                            button:hover { background-color:rgb(191, 2, 254); }
                        </style>
                        </head>
                        <body>
                            <h2>Simulación de Pago con PayPal</h2>
                            <p>Redireccionando de forma segura a PayPal...</p>
                            <p>Haz clic en "Confirmar Pago" para finalizar la simulación.</p>
                            <button onclick="window.opener.pagoExitoso(); window.close();">Confirmar Pago</button>
                        </body>
                        </html>
                    `);
                    ventanaPayPal.document.close(); // Cierra el flujo de escritura
                } else {
                    alert("La ventana emergente de PayPal fue bloqueada. Por favor, permítela.");
                }
            }

            function pagoExitoso() {
                // Función llamada desde la ventana emergente de PayPal
                alert('¡Pago con PayPal completado con éxito!');
                localStorage.setItem('transaccion', JSON.stringify({ plan: plan, metodo: 'PayPal' }));
                window.location.href = 'CONFIRMACION_PAGO.html';
            }


            async function generarReferenciaOXXO() {
                const referencia = Math.random().toString(36).substr(2, 12).toUpperCase();
                const fechaVencimiento = new Date(Date.now() + 172800000); // 2 días en milisegundos
                const fechaVencimientoStr = fechaVencimiento.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
                const monto = obtenerMontoPlan(plan); // Obtener monto del plan
                const descripcionPlan = obtenerDescripcionPlan(plan);

                document.getElementById('referenciaOxxo').innerHTML = `
                    <p>Referencia: <span class="referencia-num">${referencia}</span></p>
                    <p>Monto: <span class="referencia-num">$${monto} MXN</span></p>
                    <p>Vence: ${fechaVencimientoStr}</p>
                    <button class="btn-primary" onclick="generarPdfOXXO('${referencia}', '${monto}', '${fechaVencimientoStr}', '${descripcionPlan}')">Descargar Ficha de Pago (PDF)</button>
                `;
            }

            async function generarPdfOXXO(referencia, monto, fechaVencimiento, descripcionPlan) {
                const doc = new jsPDF();

                // Estilos
                const mainColor = '#8c00ff'; // Morado
                const textColor = '#333333';
                const lightTextColor = '#666666';
                const fontFamily = 'Helvetica';

                doc.setFont(fontFamily);
                doc.setTextColor(textColor);

                // Título
                doc.setFontSize(22);
                doc.setTextColor(mainColor);
                doc.text("Ficha de Pago en OXXO", 105, 30, { align: 'center' });

                // Información de Komaink (Simulada)
                doc.setFontSize(10);
                doc.setTextColor(lightTextColor);
                doc.text("Komaink", 10, 45);
                doc.text("Av. Tecnológico, Aguascalientes, México.", 10, 50);
                doc.text("Tax ID: 0-04-000-00-000000", 10, 55);

                // Línea separadora
                doc.setDrawColor(mainColor);
                doc.line(10, 65, 200, 65);

                // Detalles del Plan
                doc.setFontSize(14);
                doc.setTextColor(textColor);
                doc.text(`Plan: ${descripcionPlan}`, 10, 75);
                doc.text(`Monto a Pagar: $${monto} MXN`, 10, 85);
                doc.text(`Referencia de Pago: ${referencia}`, 10, 95);
                doc.text(`Fecha de Vencimiento: ${fechaVencimiento}`, 10, 105);

                // Instrucciones para el pago
                doc.setFontSize(12);
                doc.setTextColor(textColor);
                doc.text("Instrucciones para Pago en OXXO:", 10, 125);
                doc.setFontSize(10);
                doc.text("1. Dirígete a cualquier tienda OXXO.", 15, 135);
                doc.text("2. Indica al cajero que deseas realizar un pago de servicio.", 15, 142);
                doc.text("3. Proporciona el número de referencia:", 15, 149);
                doc.setFontSize(12);
                doc.setTextColor(mainColor);
                doc.text(referencia, 20, 156);
                doc.setFontSize(10);
                doc.setTextColor(textColor);
                doc.text("4. Confirma el monto a pagar: $" + monto + " MXN.", 15, 163);
                doc.text("5. Realiza el pago en efectivo y guarda tu comprobante.", 15, 170);
                doc.text("El pago puede tardar hasta 24 horas en reflejarse.", 15, 177);


                // Código de Barras (simulación simple: rectángulos)
                doc.setFontSize(8);
                doc.text("Código de Barras (simulado)", 105, 190, { align: 'center' });
                // Generar un código de barras simulado simple (solo visual)
                const xStart = 70;
                const yStart = 200;
                const barWidth = 0.5;
                const barHeight = 20;
                for (let i = 0; i < 50; i++) {
                    const isBlack = Math.random() > 0.5;
                    if (isBlack) {
                        doc.rect(xStart + (i * barWidth), yStart, barWidth, barHeight, 'F');
                    }
                }
                doc.setFontSize(10);
                doc.text("_____________________________________________________________", 105, 225, { align: 'center' }); // Línea para firma

                // Pie de página
                doc.setFontSize(8);
                doc.setTextColor(lightTextColor);
                doc.text("Gracias por tu suscripción a Komaink.", 105, 280, { align: 'center' });
                doc.text("Este documento es una guía de pago, no un recibo.", 105, 285, { align: 'center' });


                doc.save(`Ficha_Pago_OXXO_Komaink_${referencia}.pdf`);
            }

            function procesarPago() {
                const numeroTarjetaInput = document.getElementById('numeroTarjeta');
                const fechaExpInput = document.getElementById('fechaExp');
                const cvvInput = document.getElementById('cvv');

                // Validación de tarjeta (básica)
                if (numeroTarjetaInput.value && numeroTarjetaInput.value.length !== 19) {
                    alert('Número de tarjeta incompleto. Debe tener 16 dígitos.');
                    return;
                }
                if (numeroTarjetaInput.value && (!fechaExpInput.value || !cvvInput.value)) {
                    alert('Por favor, completa la fecha de expiración y el CVV de la tarjeta.');
                    return;
                }
                
                // Simular protección de datos
                const datos = {
                    plan: plan,
                    ultimosDigitos: numeroTarjetaInput.value ? numeroTarjetaInput.value.slice(-4) : 'N/A',
                    metodo: numeroTarjetaInput.value ? 'Tarjeta' : 'OXXO/PayPal (por confirmar)', // Ajusta según el método final
                    // NO guardes CVV o número completo en localStorage en un entorno real
                };

                localStorage.setItem('transaccion', JSON.stringify(datos));
                window.location.href = 'confirmacion.html';
            }

            function obtenerDescripcionPlan(planId) {
                const planes = {
                    'prueba': '15 días de prueba gratuita',
                    'mensual': 'Suscripción mensual',
                    'anual': 'Suscripción anual'
                };
                const monto = obtenerMontoPlan(planId);
                if (planId === 'prueba') {
                    return planes[planId];
                } else if (planes[planId]) {
                    return `${planes[planId]} - $${monto} MXN`;
                }
                return 'Plan no especificado';
            }

            function obtenerMontoPlan(planId) {
                const montos = {
                    'prueba': '0',
                    'mensual': '99',
                    'anual': '1199'
                };
                return montos[planId] || '0';
            }