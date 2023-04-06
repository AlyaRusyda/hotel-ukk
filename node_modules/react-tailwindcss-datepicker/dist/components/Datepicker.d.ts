import React from "react";
import { DateValueType, DateType, DateRangeType, ClassNamesTypeProp, ClassNameParam } from "../types";
interface Props {
    primaryColor?: string;
    value: DateValueType;
    onChange: (value: DateValueType, e?: HTMLInputElement | null | undefined) => void;
    useRange?: boolean;
    showFooter?: boolean;
    showShortcuts?: boolean;
    configs?: {
        shortcuts?: {
            today?: string;
            yesterday?: string;
            past?: (period: number) => string;
            currentMonth?: string;
            pastMonth?: string;
        } | null;
        footer?: {
            cancel?: string;
            apply?: string;
        } | null;
    } | null;
    asSingle?: boolean;
    placeholder?: string;
    separator?: string;
    startFrom?: Date | null;
    i18n?: string;
    disabled?: boolean;
    classNames?: ClassNamesTypeProp | undefined;
    inputClassName?: ((args?: ClassNameParam) => string) | string | null;
    toggleClassName?: string | null;
    toggleIcon?: ((open: ClassNameParam) => React.ReactNode) | undefined;
    inputId?: string;
    inputName?: string;
    containerClassName?: ((args?: ClassNameParam) => string) | string | null;
    displayFormat?: string;
    readOnly?: boolean;
    minDate?: DateType | null;
    maxDate?: DateType | null;
    disabledDates?: DateRangeType[] | null;
    startWeekOn?: string | null;
}
declare const Datepicker: React.FC<Props>;
export default Datepicker;
