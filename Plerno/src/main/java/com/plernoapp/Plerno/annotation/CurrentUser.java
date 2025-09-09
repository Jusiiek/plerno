package com.plernoapp.Plerno.annotation;


import java.lang.annotation.*;

@Target(ElementType.PARAMETER) // So it can be used on method parameters
@Retention(RetentionPolicy.RUNTIME) // So it's available at runtime
@Documented
public @interface CurrentUser {}