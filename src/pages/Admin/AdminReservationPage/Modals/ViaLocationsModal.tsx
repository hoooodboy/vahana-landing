import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PCModal from "@/src/components/PCModal";

interface Location {
  time: string;
  location: string;
  isPickup?: boolean;
  isDropoff?: boolean;
}

interface ViaLocationsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reservation: any;
  onCancel: () => void;
  onSave: (currentLocation: string, selectedLocationIndex: number) => void;
}

const ViaLocationsModal: React.FC<ViaLocationsModalProps> = ({
  isOpen,
  setIsOpen,
  reservation,
  onCancel,
  onSave,
}) => {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepare via locations with pickup and dropoff for the complete journey
  const [viaLocations, setViaLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (isOpen && reservation) {
      // Create an array with pickup, via locations, and dropoff
      const allLocations = [
        {
          time: reservation.pickup_time,
          location: reservation.pickup_location,
          isPickup: true,
        },
        ...(reservation.via_locations || []),
        {
          time: "", // Usually we don't have a specific time for the dropoff
          location: reservation.dropoff_location,
          isDropoff: true,
        },
      ];

      setViaLocations(allLocations);

      // Check if there's a current_location to determine selected index
      if (reservation.current_location) {
        const index = allLocations.findIndex(
          (loc) => loc.location === reservation.current_location
        );
        setSelectedLocationIndex(index >= 0 ? index : null);
      } else {
        // Default to first location (pickup) if no current location
        setSelectedLocationIndex(0);
      }
    }
  }, [isOpen, reservation]);

  const handleLocationSelect = (index: number) => {
    setSelectedLocationIndex(index);
  };

  const handleSave = () => {
    if (selectedLocationIndex === null) {
      alert("위치를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the selected location
      const selectedLocation = viaLocations[selectedLocationIndex].location;
      onSave(selectedLocation, selectedLocationIndex);
    } catch (error) {
      console.error("현재 위치 정보 저장 중 오류 발생:", error);
      setIsSubmitting(false);
    }
  };

  // Format the timestamp for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "-";

    // Handle date-time string
    if (timeString.includes("T")) {
      const date = new Date(timeString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    // Return as is for already formatted times
    return timeString;
  };

  const getLocationTypeLabel = (location: Location) => {
    if (location.isPickup) return "출발";
    if (location.isDropoff) return "도착";
    return "경유";
  };

  const getLocationTypeColor = (location: Location) => {
    if (location.isPickup) return "#3E4730"; // Green for departure
    if (location.isDropoff) return "#76865F"; // Red for arrival
    return "#AEBF9A"; // Blue for via locations
  };

  return (
    <PCModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>경유지 관리</ModalTitle>
          <ModalSubtitle>여정의 현재 위치를 선택해주세요</ModalSubtitle>
        </ModalHeader>

        <LocationsContainer>
          {viaLocations.map((location, index) => (
            <LocationItem
              key={index}
              onClick={() => handleLocationSelect(index)}
              isSelected={selectedLocationIndex === index}
              isCompleted={
                selectedLocationIndex !== null && index <= selectedLocationIndex
              }
            >
              <LocationProgress>
                <ProgressIndicator
                  isCompleted={
                    selectedLocationIndex !== null &&
                    index <= selectedLocationIndex
                  }
                  color={getLocationTypeColor(location)}
                >
                  {selectedLocationIndex !== null &&
                    index <= selectedLocationIndex && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                </ProgressIndicator>
                {index < viaLocations.length - 1 && (
                  <ProgressLine
                    isCompleted={
                      selectedLocationIndex !== null &&
                      index < selectedLocationIndex
                    }
                  />
                )}
              </LocationProgress>

              <LocationContent>
                <LocationTimeAndType>
                  <LocationTime>{formatTime(location.time)}</LocationTime>
                  <LocationType color={getLocationTypeColor(location)}>
                    {getLocationTypeLabel(location)}
                  </LocationType>
                </LocationTimeAndType>
                <LocationAddress>{location.location}</LocationAddress>
              </LocationContent>
            </LocationItem>
          ))}
        </LocationsContainer>

        <ModalButtons>
          <CancelButton onClick={onCancel} disabled={isSubmitting}>
            취소
          </CancelButton>
          <ConfirmButton
            onClick={handleSave}
            disabled={isSubmitting || selectedLocationIndex === null}
          >
            {isSubmitting ? "저장 중..." : "적용"}
          </ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </PCModal>
  );
};

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 28px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  margin-bottom: 28px;
`;

const ModalTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #333;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const LocationsContainer = styled.div`
  margin-bottom: 28px;
`;

const LocationItem = styled.div<{ isSelected: boolean; isCompleted: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.isSelected ? "#f0f7ff" : "white")};
  border: 1px solid ${(props) => (props.isSelected ? "#c9e0ff" : "#eaeaea")};

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#f0f7ff" : "#f8f8f8")};
  }
`;

const LocationProgress = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  min-height: 50px;
`;

const ProgressIndicator = styled.div<{ isCompleted: boolean; color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.isCompleted ? props.color : "white")};
  border: 2px solid ${(props) => props.color};
  transition: all 0.2s ease;
`;

const ProgressLine = styled.div<{ isCompleted: boolean }>`
  width: 2px;
  height: 100%;
  background-color: ${(props) => (props.isCompleted ? "#666" : "#eaeaea")};
  flex-grow: 1;
  margin: 4px 0;
`;

const LocationContent = styled.div`
  flex: 1;
`;

const LocationTimeAndType = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const LocationTime = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #555;
`;

const LocationType = styled.span<{ color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${(props) => props.color};
  padding: 4px 10px;
  border-radius: 20px;
`;

const LocationAddress = styled.div`
  font-size: 15px;
  color: #333;
  line-height: 1.4;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f1f3f5;
  color: #495057;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #3e4730;
  color: white;
  box-shadow: 0 2px 4px rgba(62, 71, 48, 0.2);

  &:hover:not(:disabled) {
    background-color: #2b331f;
    box-shadow: 0 4px 8px rgba(62, 71, 48, 0.3);
  }
`;

export default ViaLocationsModal;
