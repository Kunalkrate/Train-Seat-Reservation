import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


interface Seat {
  number: number;
  booked: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Train Seat Reservation System';

  numSeats: number = 1;  // Number of seats to book
  seatLayout: Seat[][] = this.initializeSeatLayout();  // Seat layout
  bookedSeats: number[] = [];  // Array to hold all booked seats
  bookingDisabled: boolean = false;  // Track if booking is disabled
  seatsLeft: number = 80;  // Total number of seats available initially


  initializeSeatLayout(): Seat[][] {
    let layout: Seat[][] = [];
    let seatNumber = 1;

    // 10 rows with 7 seats each
    for (let row = 0; row < 10; row++) {
      let rowSeats: Seat[] = [];
      for (let seat = 0; seat < 7; seat++) {
        rowSeats.push({ number: seatNumber++, booked: false });
      }
      layout.push(rowSeats);
    }

    // Add one more row with 7 seats to make it 80
    let finalRow: Seat[] = [];
    for (let seat = 0; seat < 7; seat++) {
      finalRow.push({ number: seatNumber++, booked: false });
    }
    layout.push(finalRow);

    // Add the last row with 3 seats
    let lastRow: Seat[] = [];
    for (let seat = 0; seat < 3; seat++) {
      lastRow.push({ number: seatNumber++, booked: false });
    }
    layout.push(lastRow);

    return layout;
  }


  // Function to book seats
  bookSeats() {
    let seatsToBook = this.numSeats;

    // Find available seats in the same row if possible
    let availableSeats: Seat[] = this.findSeatsInRow(seatsToBook);

    // If no single row has enough seats, find seats nearby
    if (!availableSeats.length) {
      availableSeats = this.findNearbySeats(seatsToBook);
    }


    // If there are enough available seats, book them
    if (availableSeats.length) {
      // Append the newly booked seats to the cumulative list of booked seats
      this.bookedSeats = this.bookedSeats.concat(availableSeats.map(seat => seat.number));

      // Mark the seats as booked in the layout
      this.markSeatsAsBooked(availableSeats);

      // Update seats left
      this.seatsLeft -= availableSeats.length;

      // Disable the booking button after successful booking
      this.bookingDisabled = true;
    } else {
      alert('Not enough seats available!');
    }

  }

  // Find available seats in a row that can accommodate the requested number of seats
  findSeatsInRow(seatCount: number): Seat[] {
    for (let row of this.seatLayout) {
      let availableSeats: Seat[] = row.filter(seat => !seat.booked);
      if (availableSeats.length >= seatCount) {
        return availableSeats.slice(0, seatCount);
      }
    }
    return [];
  }

  // Find nearby available seats if no single row has enough available seats
  findNearbySeats(seatCount: number): Seat[] {
    let availableSeats: Seat[] = [];
    for (let row of this.seatLayout) {
      availableSeats = availableSeats.concat(row.filter(seat => !seat.booked));
      if (availableSeats.length >= seatCount) {
        return availableSeats.slice(0, seatCount);
      }
    }
    return availableSeats;
  }

  // Mark the selected seats as booked
  markSeatsAsBooked(seats: Seat[]) {
    seats.forEach((seat: Seat) => {
      this.seatLayout.forEach(row => {
        let targetSeat = row.find(s => s.number === seat.number);
        if (targetSeat) {
          targetSeat.booked = true;
        }
      });
    });
  }
}
