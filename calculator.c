
#include <math.h>
#include <emscripten.h>

#define PI 3.14159265358979323846

EMSCRIPTEN_KEEPALIVE
double calculate(double a, double b, int op) {
    switch (op) {
        case 0: return a + b;
        case 1: return a - b;
        case 2: return a * b;
        case 3: return (b == 0) ? NAN : a / b;
        case 4: return pow(a, b);
        default: return NAN;
    }
}

EMSCRIPTEN_KEEPALIVE
double calculateUnary(double a, int op) {
    switch (op) {
        case 0: return sin(a * PI / 180.0);
        case 1: return cos(a * PI / 180.0);
        case 2: return tan(a * PI / 180.0);
        case 3: return (a < 0) ? NAN : sqrt(a);
        case 4: return (a <= 0) ? NAN : log(a);
        case 5: return (a <= 0) ? NAN : log10(a);
        case 6: {
            if (a < 0 || a > 170 || floor(a) != a)
                return NAN;

            double result = 1;
            for (int i = 2; i <= (int)a; i++)
                result *= i;

            return result;
        }
        default: return NAN;
    }
}
