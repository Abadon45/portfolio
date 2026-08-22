"use client";

import {
  formatIncompletePhoneNumber,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type CountryOption = {
  code: CountryCode;
  name: string;
  callingCode: string;
};

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(country: CountryCode) {
  return displayNames.of(country) ?? country;
}

function Flag({ country }: { country: CountryCode }) {
  return (
    <Box
      aria-hidden="true"
      className={`fi fi-${country.toLowerCase()}`}
      component="span"
      sx={{
        display: "inline-block",
        flexShrink: 0,
        fontSize: 18,
        lineHeight: 1,
        width: "1.3em",
      }}
    />
  );
}

const countryOptions: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    name: countryName(code),
    callingCode: getCountryCallingCode(code),
  }))
  .sort((left, right) => left.name.localeCompare(right.name));

const countryByCode = new Map(
  countryOptions.map((option) => [option.code, option]),
);

type InternationalPhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: CountryCode;
  label?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
};

function detectBrowserCountry(fallback: CountryCode) {
  if (typeof navigator === "undefined") return fallback;

  try {
    const localeCountry = new Intl.Locale(navigator.language).region as
      CountryCode | undefined;
    if (localeCountry && countryByCode.has(localeCountry)) return localeCountry;
  } catch {
    // Use the timezone hint below when Intl.Locale is unavailable.
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Manila"
    ? "PH"
    : fallback;
}

function nationalDigits(value: string, country: CountryCode) {
  const parsed = parsePhoneNumberFromString(value);
  if (parsed) return parsed.nationalNumber;

  const digits = value.replace(/\D/g, "");
  const callingCode = getCountryCallingCode(country);
  return digits.startsWith(callingCode)
    ? digits.slice(callingCode.length)
    : digits.replace(/^0/, "");
}

function formatNationalNumber(value: string, country: CountryCode) {
  const digits = nationalDigits(value, country);

  // Preserve the checkout's established Philippine mobile pattern while the
  // international countries continue to use libphonenumber metadata.
  if (country === "PH") {
    return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)]
      .filter(Boolean)
      .join(" ");
  }

  return formatIncompletePhoneNumber(digits, country);
}

export default function InternationalPhoneField({
  value,
  onChange,
  defaultCountry = "PH",
  label = "Mobile number",
  name = "mobile",
  error = false,
  helperText = "Select a country and enter the number in any common local format.",
  disabled = false,
  required = false,
}: InternationalPhoneFieldProps) {
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [countrySearch, setCountrySearch] = useState("");
  const [countryAnchor, setCountryAnchor] = useState<HTMLElement | null>(null);
  const countryTouched = useRef(false);
  const selectedCountry =
    countryByCode.get(country) ?? countryByCode.get("PH")!;
  const displayValue = formatNationalNumber(value, country);
  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    if (!query) return countryOptions;
    return countryOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(query) ||
        option.code.toLowerCase().includes(query) ||
        option.callingCode.includes(query.replace(/^\+/, "")),
    );
  }, [countrySearch]);

  useEffect(() => {
    if (!value) {
      if (!countryTouched.current)
        setCountry(detectBrowserCountry(defaultCountry));
      return;
    }

    const parsed = parsePhoneNumberFromString(value);
    if (parsed?.country) setCountry(parsed.country);
  }, [defaultCountry, value]);

  function updateCountry(nextCountry: CountryCode) {
    countryTouched.current = true;
    setCountry(nextCountry);
    setCountryAnchor(null);
    setCountrySearch("");
    const digits = nationalDigits(value, country);
    onChange(digits ? `+${getCountryCallingCode(nextCountry)}${digits}` : "");
  }

  function updateNumber(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    if (!raw.trim()) {
      onChange("");
      return;
    }

    const parsed = parsePhoneNumberFromString(raw, country);
    if (parsed) {
      onChange(parsed.number);
      return;
    }

    const digits = raw.replace(/\D/g, "").replace(/^0/, "");
    onChange(digits ? `+${getCountryCallingCode(country)}${digits}` : "");
  }

  return (
    <>
      <TextField
        autoComplete="tel"
        disabled={disabled}
        error={error}
        fullWidth
        helperText={helperText}
        inputMode="tel"
        label={label}
        name={name}
        onChange={updateNumber}
        required={required}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                <IconButton
                  aria-label={`Select country, currently ${selectedCountry.name}`}
                  disabled={disabled}
                  onClick={(event) => setCountryAnchor(event.currentTarget)}
                  sx={{
                    borderRadius: 1,
                    gap: 0.75,
                    minHeight: 40,
                    minWidth: { xs: 78, sm: 88 },
                    px: 1,
                  }}
                >
                  <Box
                    aria-hidden="true"
                    component="span"
                    sx={{ fontSize: 19 }}
                  >
                    <Flag country={selectedCountry.code} />
                  </Box>
                  <Typography
                    component="span"
                    sx={{ color: "text.primary", fontSize: 14 }}
                  >
                    +{selectedCountry.callingCode}
                  </Typography>
                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        type="tel"
        value={displayValue}
      />
      <Popover
        anchorEl={countryAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => {
          setCountryAnchor(null);
          setCountrySearch("");
        }}
        open={Boolean(countryAnchor)}
        slotProps={{
          paper: {
            sx: { borderRadius: 2, mt: 1, width: { xs: 300, sm: 360 } },
          },
        }}
      >
        <Paper elevation={0} sx={{ p: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Search for countries"
            onChange={(event) => setCountrySearch(event.target.value)}
            placeholder="Country or calling code…"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            value={countrySearch}
          />
          <List
            dense
            disablePadding
            sx={{ maxHeight: 300, mt: 1, overflowY: "auto" }}
          >
            {filteredCountries.map((option) => (
              <ListItemButton
                key={option.code}
                onClick={() => updateCountry(option.code)}
                selected={option.code === country}
                sx={{ borderRadius: 1, minHeight: 44 }}
              >
                <Box
                  aria-hidden="true"
                  component="span"
                  sx={{ fontSize: 20, mr: 1.25 }}
                >
                  <Flag country={option.code} />
                </Box>
                <ListItemText primary={option.name} secondary={option.code} />
                <Typography color="text.secondary" variant="body2">
                  +{option.callingCode}
                </Typography>
              </ListItemButton>
            ))}
            {!filteredCountries.length && (
              <Typography color="text.secondary" sx={{ p: 2 }}>
                No countries match that search.
              </Typography>
            )}
          </List>
        </Paper>
      </Popover>
    </>
  );
}

export { countryOptions };
