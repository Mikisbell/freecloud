import { login } from '../actions'
import { Code } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const metadata = {
    title: 'Admin Login | FreeCloud CMS',
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#08080f] p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            <div className="w-full max-w-sm relative z-10 animate-fade-in">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-teal-500/20">
                        <Code className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold font-grotesk text-white tracking-tight">
                        FreeCloud Admin
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Panel de gestión de contenido
                    </p>
                </div>

                {/* Card */}
                <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl shadow-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-white">Iniciar Sesión</CardTitle>
                        <CardDescription className="text-white/40">Ingresa tus credenciales para acceder</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/60">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-teal-500/50 min-h-11"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white/60">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-teal-500/50 min-h-11"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-xs text-red-400 text-center font-medium">{error}</p>
                                </div>
                            )}

                            <Button
                                formAction={login}
                                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg shadow-teal-500/20 border-0 mt-2 min-h-11 font-semibold"
                            >
                                Acceder al Panel
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-white/20 mt-8">
                    FreeCloud CMS &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}
