# Programa: Hardy Cross para HP Prime

## Descripción
Este programa en lenguaje HP PPL resuelve el método de distribución de momentos de Hardy Cross para nudos en estructuras aporticadas. Está diseñado específicamente para la calculadora HP Prime.

## Requisitos
- Calculadora HP Prime (física o emulador V1/V2).

## Instalación paso a paso

1. Conecta tu HP Prime al computador o abre el emulador.
2. Abre el **Connectivity Kit** de HP.
3. En el panel izquierdo, navega hasta tu calculadora -> **Programas** (Program Catalog).
4. Haz clic derecho y selecciona **Nuevo** (New).
5. Nombra el programa **HardyCross**.
6. Se abrirá el editor de código. Copia y pega TODO el contenido del archivo `hardy-cross-hp-prime.txt` que acompaña esta descarga.
7. Guarda y envía los cambios a la calculadora.

## Cómo usar el programa

1. En la calculadora, presiona `Shift` + `1` (Program Catalog).
2. Selecciona **HardyCross** y presiona **Ejecutar** (Run).
3. El programa te pedirá el número de barras que llegan al nudo (ej. 4).
4. Para cada barra, ingresa:
   - Su Rigidez (K).
   - Su Momento Fijo Inicial (M). (Recuerda usar convención de signos: antihorario positivo o como te enseñaron en clase).
5. Verás en pantalla el cálculo automático de los Factores de Distribución (DF).
6. Tras las iteraciones (tolerancia < 0.01 de error), se mostrarán los **Momentos Finales** compensados para cada barra.

---
*Hecho por FreeCloud - Herramientas para Ingenieros Civiles*
