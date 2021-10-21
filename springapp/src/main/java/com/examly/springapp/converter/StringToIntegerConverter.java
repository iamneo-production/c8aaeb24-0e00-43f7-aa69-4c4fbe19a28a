package com.examly.springapp.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class StringToIntegerConverter implements AttributeConverter<String, Integer> {

    @Override
    public Integer convertToDatabaseColumn(String attribute) {
        Integer integer = Integer.parseInt(attribute);
        return integer;
    }

    @Override
    public String convertToEntityAttribute(Integer dbData) {
        return Integer.toString(dbData);
    }
}
