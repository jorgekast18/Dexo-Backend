# Hito 2

## Integración Continua

Para los test, he decidido utilizar la librería Jest que es sugerida por el framework NestJS.

He usado la librería Jest por su facilidad de uso y su integración con el framework NestJS. Además que provee las 
las funcionalidades básica y avanzadas para crear test unitarios que permitan medir la acertividad de las funciones.

Se usa TDD (Test-Driven Development) en lugar de BDD (Behavior-Driven Development) porque TDD se enfoca directamente en 
la calidad técnica del código mediante pruebas unitarias que guían el desarrollo. TDD es ideal para estructuras 
modulares y componentes técnicos como APIs o servicios, donde el enfoque principal está en que el código funcione 
correctamente y sea mantenible.

Se integrado GitHub Actions para la integración continua. Dejando configurado un action "test.yml"
que se ejecuta cada vez que se hace un commit en las ramas "main" y "develop".

![GitHub Actions](../../assets/imgs/CI.png)