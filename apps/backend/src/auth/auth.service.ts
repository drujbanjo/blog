import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
	pswdHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10)

	constructor(private jwtService: JwtService) {}

	validateAdmin(password: string) {
		return bcrypt.compareSync(password, this.pswdHash)
	}

	login() {
		return this.jwtService.sign({ role: "admin" })
	}
}
