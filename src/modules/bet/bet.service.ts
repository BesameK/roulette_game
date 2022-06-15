import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class BetService {



    async create(req) {
        // if hashed token does not contain information about balance player's balance will be 100
        let balance = 100
        const token = getToken(req)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded['balance'] >= 0) {
                balance = decoded['balance']
            }
        } catch (err) {
            console.log('could not verify token your balance will be 100');
        }
        req.session.balance = balance;
        return {
            success: true,
            message: 'balance saved'
        }



    }

    async spin(session, betInfo) {
        if (!session.balance) {
            throw new BadRequestException("you do not have balance.")
        }
        let betAmountCount = 0
        betInfo.forEach(element => {
            betAmountCount += Number(element.betAmount)
        });

        if (betAmountCount > session.balance) {
            throw new BadRequestException("Your bet is more than your balance.")
        }
        session.balance -= betAmountCount
        const winningNumber = Math.floor(Math.random() * 37)
        const winnerBets = []
        //consider 0 as even number
        let evenOrOdd = 'odd'
        if (winningNumber % 2 == 0) {
            evenOrOdd = 'even'
        }

        betInfo.forEach(element => {
            if (element.betType == winningNumber) {
                session.balance += Number(element.betAmount) * 36
                winnerBets.push(element)

            }
            if (element.betType == 'odd' && evenOrOdd == 'odd') {
                session.balance += Number(element.betAmount) * 2
                winnerBets.push(element)

            }
            if (element.betType == 'even' && evenOrOdd == 'even') {
               session.balance += Number(element.betAmount) * 2
                winnerBets.push(element)

            }
        });
        return {
            success: true,
            data: {
                balance: await session.balance,
                winnerBets
            }
        }

    }

    async deletSession(session) {
        try {

           await session.destroy()

            return {
                success: true,
                message: "session is dstroyed"
            }
        } catch (err) {
            throw new BadRequestException(err)
        }
    }
}



function getToken(req) {
    // token is jwt hashed token which contains balance value
    // example  {  "balance":1000 }
    // try this in bearer token  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWxhbmNlIjoxMDAwfQ.kvIW7XSJuRsumKnjfTyOiPNqbaEKkUIu6eOdlq5ulrw
    try {
        const token = (req.headers['authorization'] || '').split(' ')[1];
        return token
    } catch (error) {
        return null;
    }

}
