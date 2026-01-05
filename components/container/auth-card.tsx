"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react"

type AuthStep = "login" | "signup" | "forgot-password"
type AuthMode = "login" | "signup"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "Al menos 8 caracteres", test: (pwd) => pwd.length >= 8 },
  { label: "Una letra mayúscula", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "Una letra minúscula", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "Un número", test: (pwd) => /\d/.test(pwd) },
]

export default function AuthenticationCard() {
  const [step, setStep] = useState<AuthStep>("login")
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getPasswordStrength = (password: string) => {
    const passedRequirements = passwordRequirements.filter((req) => req.test(password)).length
    if (passedRequirements === 0) return { strength: 0, label: "", color: "" }
    if (passedRequirements <= 2) return { strength: 25, label: "Débil", color: "bg-red-500" }
    if (passedRequirements <= 3) return { strength: 50, label: "Regular", color: "bg-yellow-500" }
    if (passedRequirements <= 4) return { strength: 75, label: "Buena", color: "bg-blue-500" }
    return { strength: 100, label: "Fuerte", color: "bg-green-500" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (step === "signup") { setStep("login") }

    setIsLoading(false)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setStep(newMode)
    setFormData({ username: "", password: "", confirmPassword: "", name: "" })
  }

  const goToForgotPassword = () => {
    setStep("forgot-password")
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "", name: "" }))
  }

  const getCardHeight = () => {
    switch (step) {
      case "login":
        return "h-[480px]"
      case "signup":
        return "h-[680px]"
      case "forgot-password":
        return "h-[380px]"
      default:
        return "h-[480px]"
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isSignupValid =
    step === "signup" &&
    formData.name &&
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordRequirements.filter((req) => req.test(formData.password)).length > 3

  return (
    <div className={`w-[450px] max-w-[450px] transition-all duration-700 ease-out ${getCardHeight()}`}>
      <div className="relative h-full">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl" />
        </div>

        <div className="relative h-full p-8 flex flex-col">
          {step === "login" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-white">Bienvenido</h1>
                <p className="text-white/70">Inicia sesión en tu cuenta</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user" className="text-white/90">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="user"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                      placeholder="Ingresa tu usuario"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <AlertDialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="text-white/70 hover:text-white text-sm transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Funcionalidad no disponible</AlertDialogTitle>
                        <AlertDialogDescription>La funcionalidad de recuperar contraseña no está disponible en este momento. Si perdiste la contraseña escribeme :)</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Entendido</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => switchMode("signup")}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {"¿No tienes cuenta? Regístrate"}
                </button>
              </div>
            </div>
          )}

          {step === "signup" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-white">Crear Cuenta</h1>
                <p className="text-white/70">Únete a nosotros hoy</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90">
                    Nombre Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-user" className="text-white/90">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="signup-user"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                      placeholder="Ingresa tu usuario"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white/90">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                      placeholder="Crea una contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">Fortaleza de contraseña</span>
                        <span
                          className={`text-xs font-medium ${passwordStrength.strength === 100
                            ? "text-white/90"
                            : passwordStrength.strength >= 75
                              ? "text-white/80"
                              : passwordStrength.strength >= 50
                                ? "text-white/70"
                                : "text-white/50"
                            }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${req.test(formData.password) ? "bg-white/80" : "bg-white/20"
                                }`}
                            />
                            <span
                              className={`text-xs ${req.test(formData.password) ? "text-white/80" : "text-white/40"}`}
                            >
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white/90">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                      placeholder="Confirma tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !isSignupValid}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                >
                  {isLoading ? "Creando cuenta..." : "Registrarse"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => switchMode("login")}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

