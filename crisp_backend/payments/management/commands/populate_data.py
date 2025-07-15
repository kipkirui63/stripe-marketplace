from django.core.management.base import BaseCommand
from payments.models import Tool


class Command(BaseCommand):
    help = 'Populate the database with sample tools'

    def handle(self, *args, **options):
        # Create sample tools matching the frontend data
        tools_data = [
            {
                'name': 'Business Intelligence Platform',
                'description': 'Comprehensive business intelligence and analytics platform with advanced reporting capabilities.',
                'price': 19.99
            },
            {
                'name': 'AI Writing Assistant',
                'description': 'Advanced AI-powered writing assistant for creating high-quality content, emails, and documents.',
                'price': 19.99
            },
            {
                'name': 'Smart Recruitment Tool',
                'description': 'AI-powered recruitment platform for finding, screening, and hiring the best candidates.',
                'price': 19.99
            },
            {
                'name': 'Customer Support Bot',
                'description': 'Intelligent customer support chatbot that handles inquiries 24/7 with natural language processing.',
                'price': 19.99
            },
            {
                'name': 'Financial Analytics Suite',
                'description': 'Advanced financial analytics and forecasting tool for better business decision making.',
                'price': 19.99
            },
            {
                'name': 'Marketing Automation',
                'description': 'Complete marketing automation platform with email campaigns, social media management, and analytics.',
                'price': 19.99
            },
        ]

        for tool_data in tools_data:
            tool, created = Tool.objects.get_or_create(
                name=tool_data['name'],
                defaults={
                    'description': tool_data['description'],
                    'price': tool_data['price']
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created tool: {tool.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Tool already exists: {tool.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample tools')
        )