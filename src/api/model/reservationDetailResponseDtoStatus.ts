/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * Vahana API
 * OpenAPI spec version: 1.0.0
 */

/**
 * 예약 상태
 */
export type ReservationDetailResponseDtoStatus =
  (typeof ReservationDetailResponseDtoStatus)[keyof typeof ReservationDetailResponseDtoStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ReservationDetailResponseDtoStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;
