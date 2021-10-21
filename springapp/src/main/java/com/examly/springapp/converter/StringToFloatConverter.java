package com.examly.springapp.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter
public class StringToFloatConverter implements AttributeConverter<String, Float> {
    @Override
    public Float convertToDatabaseColumn(String attribute) {
        return Float.parseFloat(attribute);
    }

    @Override
    public String convertToEntityAttribute(Float dbData) {
        return Float.toString(dbData);
    }
}
